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
    const [filter, setFilter] = useState<string>('')
    const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([])
    
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
    const handleFilter = () => {
        setFilteredPhotos( photos.filter((photo) => photo.title.toLowerCase().includes(filter.toLowerCase().trim())))
      }


    if(loading) return <Loader />

    return (<>
    {photos.length === 0 
    ? <p>No photos</p> 
    : <div>
        <div className="w-full max-w-lg px-4 min-w-[430px]">
          <input type="text" value={filter} onChange={(e) => {
            setFilter(e.target.value)
            handleFilter()
          }} placeholder="Search by title" className="my-4 block w-full rounded-md border-0 dark:bg-gray-700 text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 p-2"
           />
           {filter != '' && filteredPhotos.length === 0 && <p className="text-center text-gray-900 dark:text-gray-200">No photos found with title "{filter}"</p>}
          </div>
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full h-full p-2 place-items-center">
            {(filter != '' ? filteredPhotos : photos).map((photo) => <Photo key={photo.id} photo={photo} />)}
        </section>  
    </div>
    }
       
    </>)
}