import { NextFunction, Request, Response } from "express";

export default async function index(req: Request, res: Response, next: NextFunction) {
    res.json('Admin index')
    return
}