import { Request, Response } from 'express'

export default function notFound(req: Request, res: Response) {
    res.json({ error: 404, message: "Page not found"})
}