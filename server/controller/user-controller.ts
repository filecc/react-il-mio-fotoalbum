import { NextFunction, Request, Response } from "express";

export async function login(req: Request, res: Response, next: NextFunction){
    res.json('login')
}