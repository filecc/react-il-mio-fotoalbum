import jwt from 'jsonwebtoken'
import CustomError from '../lib/CustomErrorClass'
import { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'




export default async function checkUserID(req: Request, res: Response, next: NextFunction) {
    const prisma = new PrismaClient()
    const id = req.params.id
    const user_id = req.cookies['user-id']

    if(!user_id){
        next(new CustomError('You are not authorized. Login first.', 401))
        return
    }
    const photo = await prisma.photo.findFirst({
        where: { id: id, authorId: user_id }
    })
    if(!photo){
        next(new CustomError('Not authorized to access this resource.', 401))
        return
    }
   
    next()
    return 

}