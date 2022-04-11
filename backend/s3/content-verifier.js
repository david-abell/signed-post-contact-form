"use-strict";

const aws = require("aws-sdk");
const FileType = require("file-type");
const S3 = new aws.S3({ apiVersion: "2006-03-01" });
const {
  allowedImgTypes,
  allowedVidTypes,
  allowedDocTypes,
} = require("./allowed-filetypes");

////////////////////////////////////////
// Receives array of file record objects
// performs truncated S3 getObject for each record
// and reports content type in format { ext: 'jpg', mime: 'image/jpeg' }
// by checks the files magic number for allowed content types
////////////////////////////////////////

module.exports = async (parsedObject) => {
  // const rangeParams = { Range: "bytes=0-50" };
  for (let currentRecord of parsedObject) {
    let itemParams = {
      Range: "bytes=0-50",
      Key: currentRecord["key"],
      Bucket: currentRecord["bucket"],
    };

    console.log("item params", itemParams);

    // let recordResult = currentRecord;
    try {
      const object = await S3.getObject(itemParams).promise();
      console.log(object);
      const objectType = await FileType.fromBuffer(object.Body);

      const isVerifiedImg = allowedImgTypes.some((el) => {
        return el === objectType.mime;
      });
      const isVerifiedVid = allowedVidTypes.some((el) => {
        return el === objectType.mime;
      });
      const isVerifiedDoc = allowedDocTypes.some((el) => {
        return el === objectType.mime;
      });

      if (!isVerifiedImg && !isVerifiedVid && !isVerifiedDoc) {
        return false;
      }
    } catch (error) {
      console.log(error);
    }

    // if (recordResult["Content-Type"] !== objectType) {
    //   recordResult["Content-Type"] = objectType;
    // }

    // result.push(recordResult);
  }
  return true;
  // return result;
};
