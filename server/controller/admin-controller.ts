import { NextFunction, Request, Response } from "express";



export async function home(req: Request, res: Response, next: NextFunction) {
    res.json({
        message: 'Welcome to the admin page',
        code: 200,
        error: false
    })
    return
}