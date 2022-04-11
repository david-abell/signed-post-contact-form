async function uploadFilesViaPresignedPost(apiUrl, files, userId) {
  let postObj = {
    errors: [],
    files: [],
  };

  for (const fileEntry of files) {
    console.log("Currently processing file:", fileEntry[1]);
    const currentFilename = !fileEntry[1].name
      ? "unnamed file"
      : fileEntry[1].name;

    // append s3 key with file extension when mimetype exists
    const currentFileExtension = !fileEntry[1].type
      ? ""
      : "." + fileEntry[1]["type"].match(/([^/]+$)/g);

    try {
      //Fetch presigned post object with url and authentication fields
      let response = await urlGetter(apiUrl, userId);

      if (!response.ok) {
        throw new Error(`The file ${currentFilename} failed to upload`);
      }

      let json = await response.json();
      json.data.fields.key += currentFileExtension;
      console.log(json.data.fields.key);

      //Build request body with required authentication fields for presigned post url
      let form = new FormData();
      const contentType = fileEntry[1].type;
      Object.keys(json.data.fields).forEach((key) =>
        form.append(key, json.data.fields[key])
      );
      form.append("Content-Type", contentType);

      //Append file last
      form.append("file", fileEntry[1]);

      // CORS headers
      let headers = {
        "Access-Control-Allow-Origin": "*",
      };

      // Send the file
      response = await fetch(json.data.url, {
        method: "POST",
        headers,
        body: form,
      });

      if (!response.ok) {
        throw new Error(`The file ${currentFilename} failed to upload`);
      }
      // Save object key and metadata for event reference object
      let postFields = (({
        data: {
          fields: { key, bucket, "X-Amz-Date": postDate },
        },
      }) => ({ key, bucket, postDate }))(json);
      postFields["content-Type"] = contentType;
      postFields["file-name"] = currentFilename;

      console.log("postfields", postFields);
      postObj["files"].push(postFields);
    } catch (err) {
      postObj["errors"].push(currentFilename);
      return postObj;
    }
  }
  return postObj;
}

async function uploadFormdataViaPresignedPost(apiUrl, formBlob, userId) {
  try {
    // append s3 key with file extension when mimetype exists
    // for example   formBlob with "type": "image/png"
    //appends .png to s3 key

    const formBlobExtension = !formBlob.type
      ? ""
      : "." + formBlob["type"].match(/([^/]+$)/g);

    //Fetch presigned post object with url and authentication fields
    let response = await urlGetter(apiUrl, userId);
    if (!response.ok) {
      throw new Error("Something went wrong. Please try again.");
    }

    let json = await response.json();
    json.data.fields.key += formBlobExtension;

    //Build request body with required authentication fields for presigned post url
    let form = new FormData();
    Object.keys(json.data.fields).forEach((key) =>
      form.append(key, json.data.fields[key])
    );

    const contentType = formBlob.type;
    form.append("Content-Type", contentType);

    //Append file last
    form.append("file", formBlob);

    // CORS headers
    let headers = {
      "Access-Control-Allow-Origin": "*",
    };

    // Send the file
    response = await fetch(json.data.url, {
      method: "POST",
      headers,
      body: form,
    });
  } catch (err) {
    console.log(err);
    return `${err.message}`;
  }
  return `Files uploaded via presigned POST`;
}

async function urlGetter(apiUrl, userId) {
  let response = await fetch(apiUrl, {
    method: "POST",
    contentType: "application/json",
    body: userId,
  });
  return response;
}
