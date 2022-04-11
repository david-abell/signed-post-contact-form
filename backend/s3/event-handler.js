"use-strict";

const aws = require("aws-sdk");
const S3 = new aws.S3({ apiVersion: "2006-03-01" });
const areAllowedFileTypes = require("./content-verifier");
module.exports.newUpload = async (event, context) => {
  console.log("New S3 Record:", JSON.stringify(event, null, 2));

  // Get the object from the event
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  );

  const params = {
    Bucket: bucket,
    Key: key,
  };

  // console.log("json params:", params);
  try {
    // get JSON file from event record
    const object = await S3.getObject(params).promise();
    const parsedObject = JSON.parse(object.Body.toString("utf-8"));

    // Check for malicious file types
    if (parsedObject.files) {
      let unverifiedFiles = parsedObject.files;
      const verifiedObject = await areAllowedFileTypes(unverifiedFiles);
      console.log("New verified object:", verifiedObject);
    }

    // To Do: Build email message from verified object as done in upload-event.js
  } catch (err) {
    console.log(err);
  }
};
