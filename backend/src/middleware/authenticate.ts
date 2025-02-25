import Users from "../models/user";
import jwt from "jsonwebtoken";
import { CustomJwtPayload } from "../../types/env";

const JWT_SECRET = 'abt1234554321';

const authenticate = async (req: any, res: any, next: any) => {
    const token = req.cookies.auth_token;
    if (!token) {
        return res.redirect('/signin');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;

        if (!decoded.userId) {
            return res.redirect('/signin');
        }

        const user = await Users.findOne({ where: { id: decoded.userId } });
        if (!user) {
            return res.redirect('/signin');
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Error Verifying token', error);
        return res.redirect('/signin');
    }
};

export default authenticate;
