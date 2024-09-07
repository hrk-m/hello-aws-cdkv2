import { SNSEvent } from "aws-lambda";

const webHookUrl = 'https://hooks.slack.com/services/xxxxxx/xxxxxx';

async function handler(event: SNSEvent) {
    for (const record of event.Records) {
        try {
            await fetch(webHookUrl, {
                method: 'POST',
                body: JSON.stringify({
                    "text": `Huston, we have a problem: ${record.Sns.Message}`
                })
            });
        } catch (error) {
            console.error(`Error sending message to Slack: ${error}`);
        }
    }
}

export { handler };
