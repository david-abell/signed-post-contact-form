"use-strict";
const aws = require("aws-sdk");
const S3 = new aws.S3({ apiVersion: "2006-03-01" });

module.exports = async (parsedObject) => {
  let fileArray;
  for (let currentRecord of parsedObject) {
    let itemParams = {
      Key: currentRecord["key"],
      Bucket: currentRecord["bucket"],
    };

    console.log("item params", itemParams);

    // let recordResult = currentRecord;
    try {
      const object = await S3.getObject(itemParams).promise();
      console.log(object);
    } catch (error) {
      console.log(error);
    }
  }
  return fileArray;
};
