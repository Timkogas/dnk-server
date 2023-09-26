import * as core from 'express-serve-static-core';
import Doctor from '../../models/Doctor';

export default class DoctorAll {
  constructor(app: core.Express) {
    this._app = app;
    this._init();
  }

  private _app: core.Express;

  private _init(): void {
    this._app.get('/doctor/all', async (req, res): Promise<void> => {
      try {
        const doctors = await Doctor.find();
        res.json({
          error: false,
          error_text: '',
          data: {
            doctors: doctors
          }
        });
      } catch (error) {
        console.error('Error fetching doctors', error);
        res.json({
          error: true,
          error_text: 'Internal Server Error',
          data: {}
        });
      }
    });
  }
}