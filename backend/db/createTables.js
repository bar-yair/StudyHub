const { dynamodb } = require('./dynamoConfig'); // Destructure to get dynamodb

const params = {
  TableName: "Messages",
  KeySchema: [
    { AttributeName: "id", KeyType: "HASH" }, // Partition key
    { AttributeName: "timestamp", KeyType: "RANGE" }, // Sort key
  ],
  AttributeDefinitions: [
    { AttributeName: "id", AttributeType: "N" },
    { AttributeName: "timestamp", AttributeType: "S" },
    { AttributeName: "username", AttributeType: "S" },
    { AttributeName: "message", AttributeType: "S" },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5,
  },
};

// Call createTable directly on dynamodb, no need for `dynamodb.dynamodb`
dynamodb.createTable(params, (err, data) => {
  if (err) {
    console.error("Unable to create table:", JSON.stringify(err, null, 2));
  } else {
    console.log("Created table:", JSON.stringify(data, null, 2));
  }
});
