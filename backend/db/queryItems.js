// queryItems.js
const { docClient } = require('./dynamoConfig');

// Example query to get all users with a specific 'id' (you can modify as needed)
const queryParams = {
  TableName: "Users",
  KeyConditionExpression: "id = :id",
  ExpressionAttributeValues: {
    ":id": 207765801, // Replace with desired id
  },
};

docClient.query(queryParams, (err, data) => {
  if (err) {
    console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
  } else {
    console.log("Query succeeded. Data:", JSON.stringify(data, null, 2));
  }
});
