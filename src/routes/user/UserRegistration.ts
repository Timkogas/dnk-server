import * as core from 'express-serve-static-core';
import User from '../../models/User';
import { verifyLaunchParams } from '../../helpers/verifyLaunchParams';
import axios from 'axios';

const requestCounter = {};

export default class UserRegistration {
    constructor(app: core.Express) {
        this._app = app;
        this._init();
    }

    private _app: core.Express;

    private _init(): void {
        this._app.post('/user/registration', async (req, res): Promise<void> => {
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

            const clientIP = req.ip;
            requestCounter[clientIP] = requestCounter[clientIP] || 0;
            requestCounter[clientIP]++;

            if (requestCounter[clientIP] > 10) { // Установите свой лимит
                res.json({
                    error: true,
                    error_text: 'to many requests',
                    data: {}
                })
                return
            }

            const data = req.body;
            axios.post(process.env.CRM_URL, data)
                .then((data) => {
                    res.json({
                        error: false,
                        error_text: 'success',
                        data: {}
                    })
                    return
                })
                .catch(() => {
                    res.json({
                        error: true,
                        error_text: 'error',
                        data: {}
                    })
                    return
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