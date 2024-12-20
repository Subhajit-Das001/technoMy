// const nodemailer = require("nodemailer");

// const client = nodemailer.createTransport({
//     service: "Gmail",
//     auth: {
//         user: "technothloniitghy@gmail.com",
//         pass: "jkgcpdybcxidugyd"
//     }
// });

// client.sendMail(
//     {
//         from: "technothloniitghy@gmail.com",
//         to: "yashkataria15@gmail.com",
//         subject: "Testing from Technothlon Server",
//         text: "Hello, this is a test mail from Technothlon Server"
//     }
// )

const mailgun = require("mailgun-js");
const DOMAIN = "sandbox3ba17a25ed7341da875b1642cb076d1c.mailgun.org";
const mg = mailgun({apiKey: "<PRIVATE_API_KEY>", domain: DOMAIN});
const data = {
	from: "Mailgun Sandbox <postmaster@sandbox3ba17a25ed7341da875b1642cb076d1c.mailgun.org>",
	to: "technothloniitghy@gmail.com",
	subject: "Hello",
	text: "Testing some Mailgun awesomness!"
};
mg.messages().send(data, function (error, body) {
	console.log(error,body);
});

// You can see a record of this email in your logs: https://app.mailgun.com/app/logs.

// You can send up to 300 emails/day from this sandbox server.
// Next, you should add your own domain so you can send 10000 emails/month for free.