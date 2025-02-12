"use strict";
const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

class Message {
    constructor(timestamp, sender, content) {
        this.timestamp = timestamp;
        this.sender = sender;
        this.content = content;
    }

    // Save a message
    save(courseId) {
        const params = {
            TableName: 'Messages',
            Item: {
                timestamp: this.timestamp,
                sender: this.sender,
                content: this.content,
                courseId: courseId
            }
        };
        return dynamoDb.put(params).promise();
    }

    // Find a message by its timestamp
    static find(timestamp) {
        const params = {
            TableName: 'Messages',
            Key: {
                timestamp: timestamp
            }
        };
        return dynamoDb.get(params).promise();
    }
}

module.exports = Message;
