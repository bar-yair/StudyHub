"use strict";
const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

class User {
    constructor(firstName, lastName, birthDate, gender, username, password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthDate = birthDate;
        this.gender = gender;
        this.username = username;
        this.password = password;
    }

    // Save a user
    save() {
        const params = {
            TableName: 'Users',
            Item: {
                username: this.username,
                firstName: this.firstName,
                lastName: this.lastName,
                birthDate: this.birthDate,
                gender: this.gender,
                password: this.password
            }
        };
        return dynamoDb.put(params).promise();
    }

    // Find a user by username
    static find(username) {
        const params = {
            TableName: 'Users',
            Key: {
                username: username
            }
        };
        return dynamoDb.get(params).promise();
    }

    // Delete a user by username
    static delete(username) {
        const params = {
            TableName: 'Users',
            Key: {
                username: username
            }
        };
        return dynamoDb.delete(params).promise();
    }
}

module.exports = User;
