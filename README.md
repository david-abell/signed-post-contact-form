# Contact form with multiple file uploads to AWS S3 via presigned post and lambda post processing

Presigned post code adapted from the excellent article: [S3 Uploads - Proxies vs Presigned URLs vs Presigned POSTs](https://medium.com/@zaccharles/9661e2b37932) by Zac Charles.

SES mail handling inspired by [How to Set Up Serverless Form Submissions with AWS Lambda](https://www.dlford.io/aws-lambda-handling-form-submissions/) by Dan Ford.

## Deployment instructions

Run `npm install` then `serverless deploy` in the `backend` directory.

This will create an S3 bucket, two Lambda functions, and an API Gateway REST API.

## Frontend testing

Replace the form element with `id=urlinput`'s `action URL` in `presigned-post.html` in the `frontend` directory with the url from the deployed backend console output.
