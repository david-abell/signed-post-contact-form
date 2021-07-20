"use strict";

const AWS = require("aws-sdk");
const uuid = require("uuid");
const BUCKET_NAME = process.env["BUCKET_NAME"];
const s3 = new AWS.S3();

module.exports.sign = async (event) => {
  let fileId = uuid.v4();
  let userId = JSON.parse(event.body).userId;
  let keyName = "user/" + userId + "/" + fileId;
  let params = {
    Bucket: BUCKET_NAME,
    // Fields: {
    //   key: "user/" + userId + "/" + fileId,
    // },
    Conditions: [
      ["content-length-range", 0, 524288],
      ["starts-with", "$Content-Type", ""],
      ["starts-with", "$key", keyName],
      // ["starts-with", "$x-amz-meta-userid", ""],
    ],
    Expires: 300,
  };
  console.log(event);
  let data = await createPresignedPostPromise(params);
  data.fields.key = keyName;
  try {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
      body: JSON.stringify({ fileId, data }),
    };
  } catch (err) {
    console.error(err);
  }
};

function createPresignedPostPromise(params) {
  return new Promise((resolve, reject) => {
    s3.createPresignedPost(params, (err, data) => {
      if (err) {
        console.error("Presigning post data encountered an error", err);
        reject(err);
      } else {
        console.log("The post data is", data);
        resolve(data);
      }
    });
  });
}
