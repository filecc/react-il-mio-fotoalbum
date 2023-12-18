import { useContext, useEffect, useState } from "react"
import { UrlContext } from "../../lib/context/UrlContext"
import Loader from "../Loader"
import { CheckBadgeIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline"
  
  export default function Dashboard() {
    const [photos, setPhotos] = useState<Photo[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const url = useContext(UrlContext)
    useEffect(() => {
        const getPhotos = async () => {
            const res = await fetch(url + 'admin/photos?startIndex=0&maxIndex=10', {
                credentials: 'include'
            })
            const result = await res.json()
            console.log(result)
            if(result.code == 200){
                setPhotos(result.data)
            }
            setLoading(false)
        }
        getPhotos()
    }, [url])

    if(loading) return <Loader />

    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">Welcome Admin.</h1>
            <p className="mt-2 text-sm text-gray-700">
              Here's a list of all photos in the feeds.
            </p>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      Photo
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Title
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Posted
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Available
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Visible
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Author email
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {photos.map((photo) => (
                    <tr key={photo.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        <img className="w-16 h-16 rounded" src={url + 'images/' +photo.link} alt={photo.title} />
                       
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{photo.title}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(photo.created_at).toLocaleDateString()}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{photo.available ? <CheckBadgeIcon className="h-6 w-6 text-green-600" /> : <ExclamationCircleIcon className="h-6 w-6 text-red-600" />}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{photo.visible ? <CheckBadgeIcon className="h-6 w-6 text-green-600" /> : <ExclamationCircleIcon className="h-6 w-6 text-red-600" />}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{photo.author.email}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <a href="#" className="text-blue-600 hover:text-blue-900">
                          Edit<span className="sr-only"></span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }
  