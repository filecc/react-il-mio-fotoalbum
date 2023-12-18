/* eslint-disable @typescript-eslint/no-unused-vars */
interface User {
    name: string;
    email: string;
    id: number;
}

interface Photo {
    id: string;
    title: string;
    description: string;
    visible: boolean;
    link: string;
    categories: string[];
    author: User;
    created_at: string
    available: boolean;
}

interface FieldError {
    field: string;
    message: string;
}

interface Pagination{
    pages: number;
    nextPage: string | null;
    previousPage: string | null;
    data: Photo[]
    code: number,
    message: string,
    error: boolean,
    total: number
}