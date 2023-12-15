import { NextFunction, Request, Response } from "express";
import { Result, validationResult } from "express-validator";
import CustomError from "../lib/CustomErrorClass";
import { comparePassword, hashPassword } from "../lib/utils/functions";
import jwt from 'jsonwebtoken'

import { prisma } from "../server"

export async function register(req: Request, res: Response, next: NextFunction){
    console.log(req.body)

    const validations : Result = validationResult(req);
    if(!validations.isEmpty()){
        next(new CustomError('There are some errors. Check out them.', 500, validations.array()))
        return
    }

    const { email, name, password } = req.body
    const hashedPassword = await hashPassword(password)
    const user = await prisma.user.create({
        data: {
            email: email,
            name: name,
            password: hashedPassword
        }
    })
    if(!user){
        next(new CustomError('Something went wrong.', 500))
        return
    }

    const payload = {
        id: user.id,
        email: user.email
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: "1h"
    })
    res.status(200).cookie('fa-token', token, {
        expires: new Date(Date.now() + 3600000),
        path: '/',
    }).cookie('user-id', user.id, {
        expires: new Date(Date.now() + 3600000),
        path: '/',
    }).json({
        message: 'Successfully signed up.',
        code: 200,
        error: false,
        data: payload
    })
}
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
        const token = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_SECRET as string, {
            expiresIn: "1h"
        })
        res.status(200).cookie('fa-token', token, {
            expires: new Date(Date.now() + 3600000),
            path: '/',
        }).cookie('user-id', user.id, {
            expires: new Date(Date.now() + 3600000),
            path: '/',
        }).json({
            message: 'Logged in successfully.',
            code: 200,
            error: false
        })
        
        
         
}

export async function logout(req: Request, res: Response, next: NextFunction){
    res.clearCookie('fa-token').clearCookie("user-id").json({ code: 200,
        error: false,  message: 'Logged out successfully.', })
}

export async function isLogged(req: Request, res: Response, next: NextFunction){
    const token = req.cookies['fa-token']
    if(!token){
        res.json({result: false})
        return
    }
    if(!jwt.verify(token, process.env.JWT_SECRET as string)){
        res.json({result: false})
        return
    } else {
        res.json({result: true})
        return
    }
   
    
}

export async function getUserData(req: Request, res: Response, next: NextFunction){
    const user_id = req.cookies['user-id']
    const user = await prisma.user.findFirst({
        where: { id: user_id },
        select: { name: true, email: true, id: true }
    })
    res.json({ code: 200, error: false, data: user })

}
export async function getUserPublic(req: Request, res: Response, next: NextFunction){
    const user_id = req.params.id
    const user = await prisma.user.findFirst({
        where: { id: user_id },
        select: { name: true }
    }) 
    if(!user){
        next(new CustomError('User not found.', 500))
        return
    }
    res.json({ code: 200, error: false, data: user })

}