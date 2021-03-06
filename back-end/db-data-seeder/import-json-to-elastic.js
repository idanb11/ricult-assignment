const { createReadStream } = require("fs");
const path = require("path");
const split = require("split2");
const { Client } = require("@elastic/elasticsearch");

async function importData() {
  const client = new Client({ node: "http://localhost:9200" });

  try {
    const result = await client.helpers.bulk({
      datasource: createReadStream(path.join(__dirname, "/thai-schools.json")).pipe(split()),
      onDocument(doc) {
        return {
          index: { _index: "locations" },
        };
      },
    });

    console.log(result);
    process.exit();
  } catch (error) {
    throw new Error(error);
  }
}

importData();
