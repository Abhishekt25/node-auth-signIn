import { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: import('../models/user').default; // Attach user object to Request
        }
    }
}

export interface CustomJwtPayload extends JwtPayload {
    userId: number;
}


declare namespace NodeJS{
    interface ProcessEnv{
      PORT: string;
      DB_NAME:string;
      DB_HOST: string;
      DB_USER: string;
      DB_PASS: string;
    }
}
