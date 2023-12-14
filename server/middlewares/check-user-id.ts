import jwt from 'jsonwebtoken'
import CustomError from '../lib/CustomErrorClass'
import { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'




export default async function checkUserID(req: Request, res: Response, next: NextFunction) {
    const prisma = new PrismaClient()
    const id = req.params.id
    const user_id = req.cookies['user-id']
    const user = await prisma.user.findUnique({
        where: { id: user_id }
    })
    if(!user){
        next(new CustomError('Your credentials are malformed.', 401))
        return
    }
    if(id){
        const photo = await prisma.photo.findFirst({
            where: { id: id, authorId: user_id }
        })
        if(!photo){
            next(new CustomError('Not authorized to access this resource.', 401))
            return
        }
    }
    
   
    next()
    return 

}