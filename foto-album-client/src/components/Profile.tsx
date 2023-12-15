import { useContext, useEffect, useState } from "react"
import Loader from "./Loader"
import { UrlContext } from "../lib/context/UrlContext"
import { redirect } from "react-router-dom"

export default function Profile(){
    const [user, setUser] = useState<User>()
    const [loading, setLoading] = useState<boolean>(true)
    const url = useContext(UrlContext)
    useEffect(() => {
        const getUser = async () => {
            const res = await fetch(url+"user/userDetails", { credentials: "include" })
            const result = await res.json()
            if(result.data){
                setUser(result.data)
                setLoading(false)
            } else {
                redirect("/login")
            }
        }
        getUser()
    }, [url])

    if(loading || !user) return <Loader />

    return (<>
        <h1>{user.name}</h1>
    </>)
}