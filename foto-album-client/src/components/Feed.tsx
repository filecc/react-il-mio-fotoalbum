import { useContext, useEffect, useState } from "react"
import Loader from "./Loader"
import { UrlContext } from "../lib/context/UrlContext"
import { UpdateContext } from "../lib/context/UpdateContext"
import Photo from "./Photo"

export default function Feed(){
    const [ photos, setPhotos ] = useState<Photo[]>([])
    const [ loading, setLoading ] = useState<boolean>(true)
    const url = useContext(UrlContext)
    const { update } = useContext(UpdateContext)
    
    useEffect(() => {
        const getPhotos = async () => {
            const res = await fetch(url + "api/photos")
            const data = await res.json()
            if(data.photos){
                setPhotos(data.photos)
            }
            setLoading(false)
        }
        getPhotos()
    }, [update, url])

    if(loading) return <Loader />
    return (<>
    {photos.length === 0 
    ? <p>No photos</p> 
    : <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full h-full p-2 place-items-center">
        {photos.map((photo) => <Photo key={photo.id} photo={photo} />)}
    </section>  
    }
       
    </>)
}