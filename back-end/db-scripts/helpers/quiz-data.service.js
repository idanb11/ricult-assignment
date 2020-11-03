const fs = require('fs');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');

const Quiz = require('../../server/quiz/quiz.model');
const Question = require('../../server/question/question.model');
const Answer = require('../../server/answer/answer.model');
const ExternalData = require('../../server/answer/external-data.model');

let questionDisplayIdCounter = 0;
let answerDisplayIdCounter = 0;


class QuizDataService {
  constructor(json) {
    this.json = json;
  }

  init() {
    if (fs.existsSync(this.json)) {
      fs.readFile(this.json, 'utf8', (err, data) => {
        if (err) throw err;
        this.processQuizData(JSON.parse(data));
      });
    } else {
      throw new Error('Cannot open ' + this.json);
    }
  }

  async processQuizData(jsonData) {
    try {
      const quiz = await this.addQuizItem(jsonData);
      const questions = await this.processQuestionsData(jsonData.questions);
      const newQuiz = await this.addQuestionsDataToQuiz(questions, quiz._id);

      console.log(newQuiz);
      process.exit();
    } catch (e) {
      throw new Error(e);
    }
  }

  addQuizItem(quizData) {
    const { questions, ...data } = quizData;
    return Quiz.findOneAndUpdate({ name: data.name }, data, { upsert: true, new: true })
      .exec();
  }

  processQuestionsData(questionsData) {
    const promises = [];

    // return this.cleanCollections()
    return Promise.resolve()
      .then(() => questionsData.map(question => {
        const { answers, ...data } = question;
        data.displayId = data.displayId || `q${questionDisplayIdCounter++}`;
        promises.push(
          Question.findByIdAndUpdate(question._id, data, { new: true, upsert: true }).exec()
            .then(() => this.processAnswersData(answers))
            .then(newAnswers => this.addAnswersDataToQuestion(newAnswers, question._id))
        );
      }))
      .then(() => Promise.all(promises))
      .catch(err => console.log(err));
  }

  addQuestionsDataToQuiz(questions, quizId) {
    return Quiz.findByIdAndUpdate(quizId,
      {
        $set: { questions: questions && questions.map(question => question._id) || [] }
      }, { new: true }
    ).exec();
  }

  processAnswersData(answerData) {
    const promises = [];

    if (answerData) {
      answerData.map(answer => promises.push(this.sanitizeAndTransformAnswerData(answer)));
      return Promise.all(promises);
    } else {
      return Promise.resolve(null);
    }
  }

  addAnswersDataToQuestion(answers, questionId) {
    return Question.findByIdAndUpdate(questionId,
      {
        $set: { answers: answers && answers.map(answer => answer._id) || [] }
      }, { new: true, upsert: true }
    ).exec();
  }

  sanitizeAndTransformAnswerData(answer) {
    answer.displayId = answer.displayId || `a${++answerDisplayIdCounter}`;

    if (answer.source && answer.viewType === 'select-box') {
      const titles = answer.value.title;
      const source = this.transformAnswerData(answer.source, titles);
      const newExternalData = new ExternalData({
        data: mongoSanitize.sanitize(source, { replaceWith: ',' }),
        titles: titles,
        viewLevel: answer.viewLevel
      });

      return newExternalData.save()
        .then(() => answer.source = newExternalData._id)
        .then(() => Answer.findByIdAndUpdate(answer._id, answer, { new: true, upsert: true }).exec());
    } else {
      return Answer.findByIdAndUpdate(answer._id, mongoSanitize.sanitize(answer, { replaceWith: ',' }),
        { new: true, upsert: true }).exec();
    }
  }

  transformAnswerData(rawData, titles) {
    const clonedData = JSON.parse(JSON.stringify(rawData));
    const brandData = clonedData[titles[0]];

    for (let brandKey in brandData) {
      if (brandData.hasOwnProperty(brandKey)) {
        const brandValue = brandData[brandKey];
        const foundationData = brandValue[titles[1]];

        for (let foundationKey in foundationData) {
          if (foundationData.hasOwnProperty(foundationKey)) {
            const foundationValue = foundationData[foundationKey];
            const shadeData = foundationValue[titles[2]];
            const newShadesObject = {};
            shadeData.map((shade, index) => {
              newShadesObject[shade] = {
                _id: new mongoose.Types.ObjectId,
                name: shade,
                order: index + 1
              };
            });
            brandData[brandKey][titles[1]][foundationKey][titles[2]] = newShadesObject;
          }
        }
      }
    }
    return clonedData;
  }

  cleanCollections() {
    return Question.deleteMany({}).exec()
      .then(() => Answer.deleteMany({}).exec())
      .then(() => ExternalData.deleteMany({}).exec());
  }

}

module.exports = QuizDataService;
