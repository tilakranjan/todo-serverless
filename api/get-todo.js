/**
 * Route: GET /todo/n/{todo_id}
 */

const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-south-1' });

const _ = require('underscore');
const util = require('./util.js');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TODO_TABLE;

exports.handler = async (event) => {
    try {
        let todo_id = decodeURIComponent(event.pathParameters.todo_id);

        let params = {
            TableName: tableName,
            IndexName: "todo_id-index",
            KeyConditionExpression: "todo_id = :todo_id",
            ExpressionAttributeValues: {
                ":todo_id": todo_id
            },
            Limit: 1
        };

        let data = await dynamodb.query(params).promise();
        if(!_.isEmpty(data.Items)) {
            return {
                statusCode: 200,
                headers: util.getResponseHeaders(),
                body: JSON.stringify(data.Items[0])
            };
        } else {
            return {
                statusCode: 404,
                headers: util.getResponseHeaders()
            };
        }      
    } catch (err) {
        console.log("Error", err);
        return {
            statusCode: err.statusCode ? err.statusCode : 500,
            headers: util.getResponseHeaders(),
            body: JSON.stringify({
                error: err.name ? err.name : "Exception",
                message: err.message ? err.message : "Unknown error"
            })
        };
    }
}