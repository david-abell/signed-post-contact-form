"use-strict";

const aws = require("aws-sdk");
const FileType = require("file-type");
const s3 = new aws.S3({ apiVersion: "2006-03-01" });
const sendMail = require("../mailer/mail-handler");

module.exports.newUpload = async (event, context) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  // Get the object from the event and show its content type
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  );
  const params = {
    Bucket: bucket,
    Key: key,
    // Range: "bytes=0-50",
  };
  try {
    const object = await s3.getObject(params).promise();
    console.log("object contents:", object);

    // console.log(await FileType.fromBuffer(object.Body));
    const messageObject = JSON.parse(object.Body.toString("utf-8"));
    console.log("New Json uploaded:", messageObject);
    const mailAttempt = await sendMail(messageObject);
    return mailAttempt;

    // if (object.ContentType === "application/json") {
    // }
    // return object;
  } catch (err) {
    console.log(err);
    // const errorMessage = `Error getting object ${key} from bucket ${bucket}.`;
    // console.log(errorMessage);
    // throw new Error(err);
  }
};
