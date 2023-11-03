import * as core from 'express-serve-static-core';
import UserCheck from './user/UserCheck';
import UserEnablePush from './user/UserEnablePush';
import UserSetArchetype from './user/UserSetArchetype';
import DoctorOne from './doctor/DoctorOne';
import DoctorAll from './doctor/DoctorAll';
import UserRegistration from './user/UserRegistration';
import AdminLogin from './admin/AdminLogin';
import AdminLogout from './admin/AdminLogout';
import AdminCheck from './admin/AdminCheck';
import SendNotifications from './admin/SendNotifications';

class Routes {

  constructor(app: core.Express) {
    this._app = app;
    this._init();
  }

  private _app: core.Express;

  private _init(): void {
    this._userRoutes();
    this._doctorRoutes();
    this._adminRoutes();
  }

  private _userRoutes(): void {
    new UserCheck(this._app)
    new UserEnablePush(this._app)
    new UserSetArchetype(this._app)
    new UserRegistration(this._app)
  }

  private _doctorRoutes(): void {
    new DoctorOne(this._app)
    new DoctorAll(this._app)
  }

  private _adminRoutes(): void {
    new AdminLogin(this._app)
    new AdminLogout(this._app)
    new AdminCheck(this._app)
    new SendNotifications(this._app)
  }
}

export default Routes