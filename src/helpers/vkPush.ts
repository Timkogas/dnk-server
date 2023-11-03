import axios from "axios";
import User from "../models/User";
import dotenv from 'dotenv';

dotenv.config();

export async function setNotificationsUsers() {
    const list = await User.find({}, { uid: 1, _id: 0 }).lean();

    let index = 0;
    const batchSize = 30;
    const delay = 900;
    const length = list.length

    const checkUser = async (uid) => {
        const params = {
            access_token: process.env.ACCESS_TOKEN,
            user_id: uid,
            v: '5.131',
        };

        try {
            const response = await axios.post('https://api.vk.com/method/apps.isNotificationsAllowed', null, { params });
            const isAllowed = response.data?.response?.is_allowed;
            if (isAllowed) {
                const check = await User.findOne({ uid }).lean()
                if (check !== null) {
                    await User.updateOne({ uid }, { notifications: true });
                }
            } else {
                const check = await User.findOne({ uid }).lean()
                if (check !== null) {
                    await User.updateOne({ uid }, { notifications: false });
                }
            }
        } catch (error) {
            console.log('send notification error')
        }
    };

    const checkBatch = async () => {
        for (let i = 0; i < batchSize; i++) {
            const user = list[index];
            if (user) {
                await checkUser(user.uid);
                index++;
            } else {
                break;
            }
        }

        if (index < length) {
            setTimeout(checkBatch, delay);
        }
    };

    checkBatch();
}