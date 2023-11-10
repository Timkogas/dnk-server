import * as core from 'express-serve-static-core';
import auth from '../../helpers/auth';
import axios from 'axios';
import dotenv from 'dotenv';
import User from '../../models/User';
import Settings from '../../models/Settings';

dotenv.config();

async function makeSendNotificationsRequests(userIds, message) {
    const requestsCount = Math.ceil(userIds.length / 98);
    for (let i = 0; i < requestsCount; i++) {
        const start = i * 98;
        const end = Math.min(start + 98, userIds.length);
        const segment = userIds.slice(start, end);

        await sendNotificationsRequest(segment, message);

        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

async function sendNotificationsRequest(userIds, message) {
    const params = new URLSearchParams({
        fragment: `vk.com/app51759006`,
        access_token: process.env.ACCESS_TOKEN,
        user_ids: userIds.join(','),
        message: message,
        v: '5.131'
    }).toString();
    try {
        const response = await axios.post(`https://api.vk.com/method/notifications.sendMessage`, params);
        console.log('[Уведомления] ответ от вк', response.data);
    } catch (error) {
        console.log('[Уведомления] ошибка при отправке запроса', error);
    }
}


export default class SendNotifications {
    constructor(app: core.Express) {
        this._app = app;
        this._init();
    }

    private _app: core.Express;

    private _init(): void {
        this._app.post('/admin/notification', auth, async (req, res): Promise<void> => {
            await this._route(req, res);
        });
    }

    private async _route(req: core.Request<any>, res: core.Response<any>): Promise<void> {
        try {

            const { text, target, targetType } = req.body.text;
            console.log(target, targetType)
            if (text) {
                const usersWithNotifications = await User.find({ notifications: true }, { uid: 1, _id: 0 }).lean();
                const userIds = usersWithNotifications.map(user => user.uid);


                const settings = await Settings.findOne({});

                // await makeSendNotificationsRequests(userIds, text);
                // settings.canSendNotification = false;
                // await settings.save();

                // setTimeout(async () => {
                //     settings.canSendNotification = true;
                //     await settings.save();
                // }, 24 * 60 * 60 * 1000);

            } else {
                res.json({
                    error: true,
                    error_text: 'text is required',
                    data: {}
                });
            }

        } catch (error) {
            console.error('Error processing session check', error);
            res.json({
                error: true,
                error_text: 'Internal Server Error',
                data: {}
            });
        }
    }
}