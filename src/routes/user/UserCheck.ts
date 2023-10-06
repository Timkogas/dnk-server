import * as core from 'express-serve-static-core';
import User from '../../models/User';
import { verifyLaunchParams } from '../../helpers/verifyLaunchParams';

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
      let user = await User.findOne({ uid }).populate('archetype');

      if (!user) {
        // Пользователь не найден, создаем нового пользователя
        user = new User({ uid });
        await user.save();
      } else {
        await user.updateOne({ lastLoginDate: Date.now() })
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