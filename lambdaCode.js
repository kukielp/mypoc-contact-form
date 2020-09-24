const AWS = require('aws-sdk');
const SES = new AWS.SES();
const SENDER = '{senderEmail}';
const RECEIVER = '{recieverEmail}';
const response = {
    "isBase64Encoded": false,
    "headers": { 
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Headers': '*',
                'Content-Type': 'application/json',
            },
    "statusCode": 200,
    "body": "{\"result\": \"Success.\"}"
};
exports.handler =  async (event) => {
    console.log('Received event:', event.body);
    const result = await sendMail(JSON.parse(event.body));
    console.log(`MessageId: ${result.MessageId} succesfully sent`);
    return response
};
async function sendMail (enquiryPaylod) {
    const params = {
        Destination: {
            ToAddresses: [
                RECEIVER
            ]
        },
        Message: {
            Body: {
                Text: {
                    Data: `name: ${enquiryPaylod.name}  \nemail: ${enquiryPaylod.email} \ndesc: ${enquiryPaylod.enquiry}`,
                    Charset: 'UTF-8'
                }
            },
            Subject: {
                Data: `Website Referral Form: ${enquiryPaylod.name}`,
                Charset: 'UTF-8'
            }
        },
        Source: SENDER
    };
    return await SES.sendEmail(params).promise();
}