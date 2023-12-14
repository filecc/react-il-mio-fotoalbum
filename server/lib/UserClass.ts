export class UserClass {
    email: string
    name?: string
    password: string
    role?: string

    constructor(email: string, password: string, name?: string, role?: string){
        this.email = email
        this.password = password
        this.name = name
        this.role = role ?? 'user'
    }

}