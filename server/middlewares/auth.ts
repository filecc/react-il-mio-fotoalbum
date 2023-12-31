import jwt from 'jsonwebtoken'
import CustomError from '../lib/CustomErrorClass'
import { Request, Response, NextFunction } from 'express'


export default function auth(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1] || req.cookies['fa-token'];
    const user_id = req.cookies['user-id']
    if(!token || !user_id){
        next(new CustomError('You are not authorized. Login first.', 401))
        return
    }
    jwt.verify(token, process?.env?.JWT_SECRET as string, (err: any, decodedToken: any) => {
        if(err){
            res.clearCookie('user-id')
            res.clearCookie('fa-token')
            next(new CustomError('Error decoding your credentials. Try again.', 505))
            return
        } else if (!decodedToken){
            res.clearCookie('fa-token')
            res.clearCookie('user-id')
            next(new CustomError('You are not authorized. Login first.', 401))
            return
        } else if (decodedToken.exp < Date.now() / 1000){
            res.clearCookie('fa-token')
            res.clearCookie('user-id')
            next(new CustomError('Your session has expired. Login again.', 401))
            return
        }
    })
    next()
    return 

}