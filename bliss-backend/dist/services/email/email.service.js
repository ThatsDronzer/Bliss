import axios from 'axios';
import { logger } from '../../utils/logger';
const RESEND_API_KEY = 're_B7KMBT8b_HtmWXrojjjLg71KVFnWnk1Um';
export async function sendEmail(payload) {
    try {
        const result = await axios({
            method: 'post',
            url: 'https://api.resend.com/emails',
            data: {
                reply_to: payload.replyTo,
                from: payload.from,
                to: [payload.email],
                subject: payload.subject,
                html: payload.html,
                cc: payload.cc,
            },
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${RESEND_API_KEY}`,
            },
        });
        console.log('🚀 ~ result:', result.data);
        console.log(`Email sent to ${payload.email}`);
    }
    catch (error) {
        logger.error('Error while sendEmail()', {
            error: error.message,
            stack: error.stack,
            data: {
                ...payload,
            },
        });
    }
}
//# sourceMappingURL=email.service.js.map