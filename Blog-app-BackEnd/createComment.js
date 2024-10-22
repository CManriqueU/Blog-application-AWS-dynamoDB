import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  console.log('Received event:', JSON.stringify(event, null, 2));
  const data = JSON.parse(event);
  const command = new PutCommand({
    TableName: "Comments",
    Item: {
      commentId: data.commentId,
      commentText: data.commentText
    },
  });
  
  const response = await docClient.send(command);
  console.log(response);
  return response;
};