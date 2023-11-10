import * as core from 'express-serve-static-core';
import auth from '../../helpers/auth';
import axios from 'axios';
import dotenv from 'dotenv';
import User from '../../models/User';
import Settings from '../../models/Settings';

dotenv.config();

enum Profile {
    Profile1 = 'Девушки 18-25 лет',
    Profile2 = 'Девушки 26-33 лет',
    Profile3 = 'Женщины 34-43 лет',
    Profile4 = 'Женщины 44-56 лет',
    Profile5 = 'Мужчины 18-25 лет',
    Profile6 = 'Мужчины 26-35 лет',
    Profile7 = 'Мужчины 36-45 лет',
    Profile8 = 'Мужчины 46-54 лет'
}

const profileNames: { [key: string]: string[] } = {
    'Девушки 18-25 лет': ['парижанка', 'жанна д’арк', 'золушка', 'мальвина', 'принцесса', 'женщина-вамп', 'чемпионка', 'наташа ростова', 'дюймовочка'],
    'Девушки 26-33 лет': ['королева', 'мать тереза', 'фея', 'дюймовочка', 'золушка', 'императрица', 'мэрилин монро'],
    'Женщины 34-43 лет': ['коко шанель', 'русалка', 'бизнес-леди', 'скарлетт', 'жанна д’арк', 'дульсинея', 'провинциалка', 'мэрилин монро'],
    'Женщины 44-56 лет': ['хозяйка медной горы', 'клеопатра', 'коко шанель', 'жанна д’арк', 'бизнес-леди', 'провинциалка', 'императрица'],
    'Мужчины 18-25 лет': ['бэтмен', 'добрыня', 'мачо', 'александр македонский'],
    'Мужчины 26-35 лет': ['данко', 'тамерлан', 'мачо', 'остап бендер', 'александр македонский'],
    'Мужчины 36-45 лет': ['ковбой', 'прометей', 'пожарный', 'поддубный', 'александр македонский'],
    'Мужчины 46-54 лет': ['черчилль', 'скрудж макдак', 'пожарный', 'поддубный']
};


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

            const { text, targets, targetType } = req.body;
            console.log(targets, targetType)
            if (text) {

                const settings = await Settings.findOne({});
                if (targetType === 'archetypes') {
                    const usersWithNotifications = await User.find({
                        notifications: true,
                        'archetype': { $in: targets }
                    }, { uid: 1, _id: 0 }).lean();
                    const userIds = usersWithNotifications.map(user => user.uid);
                    // await makeSendNotificationsRequests(userIds, text);
                    // settings.canSendNotification = false;
                    // await settings.save();

                    // setTimeout(async () => {
                    //     settings.canSendNotification = true;
                    //     await settings.save();
                    // }, 24 * 60 * 60 * 1000);

                } else if (targetType === 'profiles') {
                    const allArchetypeNames: string[] = targets.reduce((acc, profile) => {
                        acc.push(...profileNames[profile]);
                        return acc;
                    }, []);

                    const allArchetypeNamesWithoutDuplicates: string[] = Array.from(new Set(allArchetypeNames));

                    console.log(allArchetypeNamesWithoutDuplicates, 'lel')

                    const usersWithNotifications = await User.find({
                        notifications: true,
                        'archetype.name': { $in: allArchetypeNamesWithoutDuplicates }
                    }, { uid: 1, _id: 0 }).lean();
                    const userIds = usersWithNotifications.map(user => user.uid);

                    console.log(usersWithNotifications, 'lol')
                    
                }
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