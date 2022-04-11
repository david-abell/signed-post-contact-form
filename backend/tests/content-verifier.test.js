const contentVerifier = require("../s3/content-verifier");

const aws = require("aws-sdk");
const FileType = require("file-type");

jest.mock("aws-sdk", () => {
  const mockGetObject = jest.fn(() => ({
    promise: jest.fn(),
  }));

  return {
    S3: jest.fn(() => {
      return { getObject: mockGetObject };
    }),
  };
});

jest.mock("file-type", () => {
  const fromBuffer = jest.fn(() => ({
    mime: "image/jpeg",
  }));

  return;
});

FileType.mock;

describe("mock promise", () => {
  it("test", () => {
    const S3 = new aws.S3();
    const request = S3.getObject({
      Bucket: "bucket",
      Key: "key",
    });
    request.promise = () => Promise.resolve("mockdata");
    request.promise().then((data) => {
      expect(data).toEqual("mockResp");
    });
  });
});

// async function functionUnderTest() {
//   const resp = await new AWS.S3().getObject().promise();
//   return resp.Body;
// }
