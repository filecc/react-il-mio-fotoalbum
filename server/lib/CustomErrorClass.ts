interface errValidations {
    path: string,
    msg: string
}


export class CustomError extends Error {
    statusCode: number;
    array?: errValidations[];
    constructor(message: string | undefined, statusCode: number, array?: errValidations[]) {
        super(message);
        this.statusCode = statusCode;
        this.array = array
    }
}
