import { FieldValidationError } from "express-validator";


export default class CustomError extends Error {
    statusCode: number;
    array?: FieldValidationError[];
    constructor(message: string | undefined, statusCode: number, array?: FieldValidationError[]) {
        super(message);
        this.statusCode = statusCode;
        this.array = array
    }
}
