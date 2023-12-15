import { useContext } from "react"
import { UrlContext } from "../lib/context/UrlContext"

export default function Photo({ photo }: { photo: Photo}){
    console.log(photo)
    const url = useContext(UrlContext)
    return (
        <>
        <img src={`${url}images/${photo.link}`} alt={photo.title + ' image'} />
        <h1>{photo.title}</h1>

        </>
    )
}