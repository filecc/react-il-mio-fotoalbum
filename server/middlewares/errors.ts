import { NextFunction, Request, Response } from "express";
import { CustomError } from "../lib/CustomErrorClass";

export default function erroHandler (err: CustomError, req: Request, res: Response, next: NextFunction){
    res.json({
        error: err.message,
        code: err.statusCode,
        messages: err.array ? err.array.map((error) => {
            return {
                field: error.path,
                message: error.msg
            }
        }) : 'No other info.'
    })
    return
}