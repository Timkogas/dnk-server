import * as core from 'express-serve-static-core';
import User from '../../models/User';

export default class UserEnablePush {
  constructor(app: core.Express) {
    this._app = app;
    this._init();
  }

  private _app: core.Express;

  private _init(): void {
    this._app.post('/user/push', async (req, res): Promise<void> => {
      this._route(req, res);
    });
  }

  private async _route(req: core.Request<any>, res: core.Response<any>): Promise<void> {
    try {
      const { uid } = req.body;
      if (!uid) {
        res.json({
          error: true,
          error_text: 'uid is required',
          data: {}
        })
        return
      }
  
      // Проверяем существование пользователя по uid
      let user = await User.findOne({ uid });
  
      if (!user) {
        res.json({
          error: true,
          error_text: 'user is not existed',
          data: {}
        })
        return
      }
  
      await user.updateOne({notifications: true})

      res.json({
        error: false,
        error_text: '',
        data: {}
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