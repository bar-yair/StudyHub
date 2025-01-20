const AWS = require('aws-sdk');

// Configure DynamoDB to use the local instance
AWS.config.update({
  region: "us-east-1", // Any region
  endpoint: "http://localhost:8000", // Local DynamoDB
  accessKeyId: "fakeMyKeyId", // Fake access key
  secretAccessKey: "fakeSecretAccessKey", // Fake secret key
});

const dynamodb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

module.exports = { dynamodb, docClient };
