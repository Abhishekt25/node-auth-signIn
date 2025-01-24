import Users from "../models/user";
import jwt from "jsonwebtoken";
import { CustomJwtPayload } from "../../types/env";

const JWT_SECRET = 'your_jwt_secret';

const authenticate = async (req: any, res: any, next: any) => {
    const token = req.cookies.auth_token;
    if (!token) {
        return res.redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;

        if (!decoded.userId) {
            return res.redirect('/login');
        }

        const user = await Users.findOne({ where: { id: decoded.userId } });
        if (!user) {
            return res.redirect('/login');
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Error Verifying token', error);
        return res.redirect('/login');
    }
};

export default authenticate;
