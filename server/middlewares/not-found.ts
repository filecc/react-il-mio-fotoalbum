import { NextFunction, Request, Response } from 'express'
import CustomError from '../lib/CustomErrorClass'

export default function notFound(req: Request, res: Response, next: NextFunction) {
    const requestUrl = req.baseUrl + req.url
    next(new CustomError(`${requestUrl} cannot accept request.`, 404))
}