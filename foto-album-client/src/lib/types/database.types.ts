/* eslint-disable @typescript-eslint/no-unused-vars */
interface User {
    name: string;
    email: string;
    id: number;
}

interface Photo {
    id: number;
    title: string;
    description: string;
    visible: boolean;
    link: string;
    categories: string[];
    author: User;
    created_at: string
}