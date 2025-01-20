const { docClient } = require('./dynamoConfig');

// Function to insert a new message
const insertMessage = async () => {
  const moment = require('moment-timezone');

  // Get current timestamp in a specific time zone (e.g., 'Asia/Tel_Aviv')
  const timestamp = moment().tz('Asia/Tel_Aviv').format(); // Use .format() to get ISO 8601 format
    

  // Placeholder for username (until you implement a login system)
  const username = "Nadav Shohat";  // Placeholder for the logged-in user
  const message = "This is a sample message.";  // Placeholder for the message content
  const course = "Computational Models"

  const params = {
    TableName: "Messages",
    Item: {
      timestamp: timestamp,  // Using timestamp as the partition key
      username: username,
      message: message,
      course: course
    }
  };

  try {
    const data = await docClient.put(params).promise();
    console.log("Message inserted:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Unable to insert message:", JSON.stringify(err, null, 2));
  }
};

// Example usage
insertMessage();
