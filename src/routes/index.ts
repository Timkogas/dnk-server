import * as core from 'express-serve-static-core';
import UserCheck from './user/UserCheck';
import UserEnablePush from './user/UserEnablePush';
import UserSetArchetype from './user/UserSetArchetype';

class Routes {

  constructor(app: core.Express) {
    this._app = app;
    this._init();
  }

  private _app: core.Express;

  private _init(): void {
    this._userRoutes();

  }

  private _userRoutes(): void {
    new UserCheck(this._app)
    new UserEnablePush(this._app)
    new UserSetArchetype(this._app)
  }

}

export default Routes