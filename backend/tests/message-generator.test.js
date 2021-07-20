const messageGenerator = require("../mailer/message-generator");
require("dotenv").config({ path: "../.env" });

const emailFrom = process.env.EMAIL_FROM;
const emailTo = process.env.EMAIL_TO;

const input = {
  formFields: {
    firstName: "Foo",
    lastName: "Bar",
    userEmail: "foo_bar@example.com",
    message: "Hello from Foo",
  },
};

const output = {
  to: emailTo,
  from: emailFrom,
  replyTo: "Foo Bar <foo_bar@example.com>",
  subject: "Contact Form",
  text: `
  First Name: Foo
  Last Name: Bar
  Email: foo_bar@example.com
  Message:
  Hello from Foo
  `,
};

test("returns constructed email object from fields json object", async () => {
  const result = await messageGenerator(input);
  expect(result).toEqual(output);
});
