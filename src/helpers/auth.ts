import Admin from "../models/Admin";


const auth = async (req, res, next) => {
    try {
        const token = req.get("Authenticate");
        if (!token) {
            res.json({
                error: true,
                error_text: 'auth error',
                data: {}
            });
            return
        }
        const user = await Admin.findOne({ token });
        if (!user) {
            res.json({
                error: true,
                error_text: 'auth error',
                data: {}
            });
            return
        };
        req.body = { ...req.body, user: user };
        next();
    } catch (e) {

        res.json({
            error: true,
            error_text: 'auth error',
            data: {}
        });
        return
    }
};

export default auth;