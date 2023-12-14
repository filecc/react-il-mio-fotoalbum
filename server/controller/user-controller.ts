import { NextFunction, Request, Response } from "express";
import { Result, validationResult } from "express-validator";
import CustomError from "../lib/CustomErrorClass";
import { comparePassword, generateJwtToken, hashPassword } from "../lib/utils/functions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export async function login(req: Request, res: Response, next: NextFunction){
    const validations : Result = validationResult(req);
    if(!validations.isEmpty()){
        next(new CustomError('There are some errors. Check out them.', 500, validations.array()))
        return
    }


    const { email, password } = req.body
    const user = await prisma.user.findFirstOrThrow({
        where: { email: email },
        select: { email: true, id: true, password: true}
    })
    const isPasswordValid = await comparePassword(password, user.password)

    if(!isPasswordValid){
        next(new CustomError('Invalid credentials.', 500))
        return
    } 

        const token = await generateJwtToken({
            id: user.id,
            email: user.email,
        })
        res.cookie('fa-token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 })
        res.cookie('user-id', user.id, { maxAge: 1000 * 60 * 60 * 24 })
        res.json({ message: 'Logged in successfully.' })    
}

export async function logout(req: Request, res: Response, next: NextFunction){
    res.clearCookie('fa-token').json({ message: 'Logged out successfully.' })
}