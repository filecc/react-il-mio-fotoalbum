import { NextFunction, Request, Response } from "express";
import CustomError from "../lib/CustomErrorClass";
import { prisma } from "../server";

export async function sendMessage(req: Request, res: Response, next: NextFunction) {
    const { email, message } = req.body;
   if (!email || !message) {
       return next(new CustomError('Please provide email and message', 400))
    }
    const messageInserted = await prisma.message.create({
        data: {
            email,
            message,
        }
    })
    if(!messageInserted) {
        return next(new CustomError('Something went wrong', 500))
    }
    res.json({
        code: 200,
        status: 'OK',
    })
}