import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { DBConnectionError } from '@exceptions/core.exceptions';
import ActiveConfig from '@utils/ActiveConfig';
import logger from '@utils/Logger';
export async function sendUsersEmail(payload) {
    try {
        const SES_CONFIG = {
            credentials: {
                accessKeyId: ActiveConfig.AWS_ACCESS_KEY_ID,
                secretAccessKey: ActiveConfig.AWS_SECRET_ACCESS_KEY,
            },
            region: 'ap-south-1',
        };
        const sesClient = new SESClient(SES_CONFIG);
        await Promise.all(payload.recipients.map(async (recipient) => {
            const params = {
                Source: 'noreply@nxtjob.ai',
                Destination: {
                    ToAddresses: [recipient],
                },
                ReplyToAddresses: [],
                Message: {
                    Body: {
                        Html: {
                            Charset: 'UTF-8',
                            Data: payload.body,
                        },
                    },
                    Subject: {
                        Charset: 'UTF-8',
                        Data: payload.subject,
                    },
                },
            };
            try {
                const sendEmailCommand = new SendEmailCommand(params);
                await sesClient.send(sendEmailCommand);
            }
            catch (error) {
                console.error('Error sending email:', error);
                throw error;
            }
        }));
        return { message: 'success' };
    }
    catch (error) {
        if (error instanceof DBConnectionError) {
            throw error;
        }
        await logger.error('Error while sendUsersEmail()', {
            error: error.message,
            stack: error.stack,
            data: { ...payload },
        });
        throw error;
    }
}
export async function sendBulkEmail(payload) {
    try {
        const response = await fetch(`${ActiveConfig.NODE_SERVER_URL}/v1/bulk/email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        return await response.json();
    }
    catch (error) {
        await logger.error('Error while sendBulkEmail()', {
            error: error.message,
            stack: error.stack,
            data: { ...payload },
        });
    }
}
//# sourceMappingURL=aws.service.js.map