"use strict";
const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

class Course {
    constructor(title, courseId, description, imageUrl) {
        this.title = title;
        this.courseId = courseId;
        this.description = description;
        this.imageUrl = imageUrl;
        this.messages = [];
    }

    // Save a course
    save() {
        const params = {
            TableName: 'Courses',
            Item: {
                courseId: this.courseId,
                title: this.title,
                description: this.description,
                imageUrl: this.imageUrl,
                messages: this.messages,
            }
        };
        return dynamoDb.put(params).promise();
    }

    // Find a course by its courseId
    static find(courseId) {
        const params = {
            TableName: 'Courses',
            Key: {
                courseId: courseId
            }
        };
        return dynamoDb.get(params).promise();
    }

    // Get all courses
    static getAll() {
        const params = {
            TableName: 'Courses'
        };
        return dynamoDb.scan(params).promise();
    }

    // Delete a course by courseId
    static delete(courseId) {
        const params = {
            TableName: 'Courses',
            Key: {
                courseId: courseId
            }
        };
        return dynamoDb.delete(params).promise();
    }

    // Add a message to a course
    static addMessage(courseId, message) {
        const params = {
            TableName: 'Courses',
            Key: {
                courseId: courseId
            },
            UpdateExpression: "SET messages = list_append(messages, :message)",
            ExpressionAttributeValues: {
                ":message": [message]
            },
            ReturnValues: "UPDATED_NEW"
        };
        return dynamoDb.update(params).promise();
    }
}

module.exports = Course;
