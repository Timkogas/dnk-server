
import { CronJob } from 'cron';
import { setNotificationsUsers } from './vkPush';


export const cron = new CronJob('00 00 * * * *', async () => {
  try {
    console.log('notification cron')
    await setNotificationsUsers()
  } catch (e) {
    console.log('notification error');
  }
});