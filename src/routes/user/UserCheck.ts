import * as core from 'express-serve-static-core';
import User, { UserInfo } from '../../models/User';
import { verifyLaunchParams } from '../../helpers/verifyLaunchParams';
import Settings from '../../models/Settings';

let requestCounter = {};

setInterval(() => {
    requestCounter = {};
}, 100000);

export default class UserCheck {
  constructor(app: core.Express) {
    this._app = app;
    this._init();
  }

  private _app: core.Express;

  private _init(): void {
    this._app.post('/user/check', async (req, res): Promise<void> => {
      this._route(req, res);
    });
  }

  private async _route(req: core.Request<any>, res: core.Response<any>): Promise<void> {
    const clientIP = req.ip;
    requestCounter[clientIP] = requestCounter[clientIP] || 0;
    requestCounter[clientIP]++;

    if (requestCounter[clientIP] > 80) { 
        res.json({
            error: true,
            error_text: 'to many requests',
            data: {}
        })
        return
    }

    try {
      if (req.headers.search) {
        const areLaunchParamsValid = verifyLaunchParams(req.headers.search);
        if (!areLaunchParamsValid) {
          res.json({
            error: true,
            error_text: 'security error',
            data: {}
          })
          return
        }
      } else {
        res.json({
          error: true,
          error_text: 'security error',
          data: {}
        })
        return
      }
      const params = new URLSearchParams(req.headers.search as string);
      const uid = params.get("vk_user_id");
      
      if (!uid) {
        res.json({
          error: true,
          error_text: 'uid is required',
          data: {}
        })
        return
      }

      // Проверяем существование пользователя по uid
      const settings = await Settings.findOne({});

      let user = await User.findOne({ uid }).populate('archetype');
      const vkData: UserInfo = req?.body?.vkData;

      if (!user) {
        // Пользователь не найден, создаем нового пользователя
        user = new User({ uid, vkdata: vkData });
        settings.uniqueStartCount++
        await user.save();
        await settings.save();
      } else {
        settings.allStartCount++;
        await user.updateOne({ lastLoginDate: Date.now(), vkdata: vkData })
        await settings.save();
      }

      // Возвращаем данные о пользователе
      res.json({
        error: false,
        error_text: '',
        data: {
          user: user
        }
      })

    } catch (error) {

      console.error('Error processing user check', error);
      res.json({
        error: true,
        error_text: 'Internal Server Error',
        data: {}
      })
    }

  }
}