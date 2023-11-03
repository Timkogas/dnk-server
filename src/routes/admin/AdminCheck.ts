import * as core from 'express-serve-static-core';
import auth from '../../helpers/auth';
import Settings from '../../models/Settings';

export default class AdminCheck {
    constructor(app: core.Express) {
        this._app = app;
        this._init();
    }

    private _app: core.Express;

    private _init(): void {
        this._app.post('/admin/check', auth, async (req, res): Promise<void> => {
            await this._route(req, res);
        });
    }

    private async _route(req: core.Request<any>, res: core.Response<any>): Promise<void> {
        try {

            const user = req.body.user;

            if (user) {

                const settings = await Settings.findOne({});
                const canSendNotification = settings ? settings.canSendNotification : false;

                res.json({
                    error: false,
                    error_text: '',
                    data: {
                        canSendNotification: canSendNotification,
                        allStartCount: settings?.allStartCount || 0,
                        uniqueStartCount: settings?.uniqueStartCount || 0,
                        getResultCount: settings?.getResultCount || 0,

                    }
                });
            }
        } catch (error) {
            console.error('Error processing session check', error);
            res.json({
                error: true,
                error_text: 'Internal Server Error',
                data: {}
            });
        }
    }
}