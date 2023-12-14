import { NextFunction, Request, Response } from "express";

const express = require('express');


export async function index(req: Request, res: Response, next: NextFunction){
    res.json('Hello World!')
}