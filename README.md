# **Ricult home assignment**

## How to install:

1. Install angular cli globally: 
```
$ npm install -g @angular/cli` 
```

2. Install Elastic Search server on your local machine - [How To](https://www.elastic.co/guide/en/elasticsearch/reference/current/install-elasticsearch.html#_installing_elasticsearch_yourself)

3. Run your local Elastic Search server on your local machine - [How To](https://www.elastic.co/guide/en/elasticsearch/reference/current/starting-elasticsearch.html)

4. Clone the github repo to your local machine: 
```
$ git clone https://github.com/idanb11/ricult-assignment.git
```

5. Change directory to back-end folder and install dependencies: 
```
$ npm install
```

6. Import seed data to Elastic Search server:
```
$ npm run import_data
```

7. Update the envirmonet file and set the Google Api Key: open file 
```
back-end/config/config.js
```
> and set the value for `googleApiKey`

8. Start the API server:
```
$ npm start
```

9. Change directory to front-end folder and install dependencies: 
```
$ npm install
```

10. Run the front-end local dev server:
```
$ ng serve --open
```

