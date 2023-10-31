import * as core from 'express-serve-static-core';
import Admin from '../../models/Admin';
import auth from '../../helpers/auth';

export default class AdminLogout {
  constructor(app: core.Express) {
    this._app = app;
    this._init();
  }

  private _app: core.Express;

  private _init(): void {
    this._app.delete('/admin/logout', auth, async (req, res): Promise<void> => {
      await this._route(req, res);
    });
  }

  private async _route(req: core.Request<any>, res: core.Response<any>): Promise<void> {
    try {
      const user = req.body.user;
      user.generateToken();
      await user.save();
      res.json({
        error: false,
        error_text: 'Success logout',
        data: {}
      });
    } catch (error) {
      console.error('Error processing admin logout', error);
      res.status(502).send({ message: "Can't logout" });
    }
  }
}