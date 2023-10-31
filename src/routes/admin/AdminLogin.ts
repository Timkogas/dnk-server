import * as core from 'express-serve-static-core';
import Admin from '../../models/Admin'

export default class AdminLogin {
  constructor(app: core.Express) {
    this._app = app;
    this._init();
  }

  private _app: core.Express;

  private _init(): void {
    this._app.post('/admin/login', async (req, res): Promise<void> => {
      await this._route(req, res);
    });
  }

  private async _route(req: core.Request<any>, res: core.Response<any>): Promise<void> {
    try {
      const username = req.body.username;
      const password = req.body.password;
      console.log(username, password)
      const admin = await Admin.findOne({ username });

      if (!admin) {
        res.json({
          error: true,
          error_text: 'Username or password is incorrect',
          data: {}
        });
        return
      }

      const isMatch = await admin.checkPassword(password);
      console.log(isMatch)
      if (!isMatch) {
        res.json({
          error: true,
          error_text: 'Username or password is incorrect',
          data: {}
        });
        return
      }

      admin.generateToken();
      await admin.save();

      res.json({
        error: false,
        error_text: 'Success login',
        data: {user: admin}
      });
    } catch (error) {
      console.error('Error processing admin login', error);
      res.json({
        error: true,
        error_text: 'Internal Server Error',
        data: {}
      });
    }
  }
}