import { useContext, useEffect, useState } from "react";
import Loader, { LoaderIMG } from "./Loader";
import { UrlContext } from "../lib/context/UrlContext";
import { redirect } from "react-router-dom";
import { UpdateContext } from "../lib/context/UpdateContext";
import EditForm from "./EditForm";
import AddForm from "./AddForm";
import { Switch } from "@headlessui/react";
import { classNames } from "../lib/utils/functions";
import { ArrowRightIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function Profile() {
  const [user, setUser] = useState<User>();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { update, setUpdate } = useContext(UpdateContext);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [enabled, setEnabled] = useState(false)
  const url = useContext(UrlContext);
  const [loadingDelete, setLoadingDelete] = useState(false)
  const [target, setTarget] = useState<string>('')
  const [filter, setFilter] = useState<string>('')
 const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([])


  useEffect(() => {
    const getUser = async () => {
      const res = await fetch(url + "user/userDetails", {
        credentials: "include",
      });
      const result = await res.json();
      if (result.data) {
        setUser(result.data);
        setLoading(false);
      } else {
        redirect("/login");
      }
    };

    getUser();
  }, [update, url]);
  useEffect(() => {
    
    async function getUserPhoto() {
      const res = await fetch(url + "api/photos/user", {
        credentials: "include",
      });
      const result = await res.json();
      if (result.data) {
        setPhotos(result.data);
      }
    }
    getUserPhoto();
  }, [update, url]);

  useEffect(() => {
    async function checkAdmin () {
      const res = await fetch("http://localhost:4000/admin/", {
        credentials: "include",
      })
      const data = await res.json()
    
      if (data.code === 200) {
       setIsAdmin(true)
      } 
     
    }
    checkAdmin()
    
  }, [url, update])

  const handleDelete = async (id: string) => {
    setLoadingDelete(true)
    const res = await fetch(url + "api/photos/delete/" + id, {
      method: "DElETE",
      credentials: "include",
    })
    const result = await res.json()
    if (result.status == 200){
      setUpdate(!update)
    }
    setLoadingDelete(false)
    setTarget('')
  }

  const handleFilter = () => {
    setFilteredPhotos( photos.filter((photo) => photo.title.toLowerCase().includes(filter.toLowerCase().trim())))
  }

  if (loading) return <Loader />;

  return (
    <>
      {user && (
        <div className="flex items-center justify-between w-full pr-6">
          <div className="flex items-center gap-2 self-start p-6">
            <span className="w-10 h-10 bg-gray-400 rounded-full grid place-items-center font-bold dark:text-gray-100">
              {user.name.charAt(0).toUpperCase()}
            </span>
            <small className="font-base font-bold text-gray-900 dark:text-gray-200">{user.name}</small>
          </div>
          <AddForm />
          {isAdmin && <a className="px-3 py-1.5 bg-blue-600 text-blue-50 rounded flex items-center gap-1" href="/admin/dashboard">Dashboard <ArrowRightIcon className="w-4 h-4" /></a>}
          <div className="flex items-center gap-2">
          <span className="font-bold text-gray-800 dark:text-white"><TrashIcon className={classNames("w-6 h-6", enabled ? 'text-red-600' : '')} /></span>
          <Switch
            checked={enabled}
            onChange={() => {
              setEnabled(!enabled)
              setTarget('')
              setLoadingDelete(false)
            }}
            className={classNames(
              enabled ? "bg-red-600" : "bg-gray-200 dark:bg-gray-600",
              "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
            )}
          >
            <span
              aria-hidden="true"
              className={classNames(
                enabled ? "translate-x-5" : "translate-x-0",
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              )}
            />
          </Switch>
          </div>
        </div>
      )}
      {photos.length === 0 ? (
        <p className="text-gray-900 dark:text-white">No photos</p>
      ) : (
        <>
          <p className="font-bold text-gray-800 dark:text-white">Your Feed</p>
          <div className="w-full max-w-xl px-4">
          <input type="text" value={filter} onChange={(e) => {
            setFilter(e.target.value)
            handleFilter()
          }} placeholder="Search by title" className="my-4 block w-full rounded-md border-0 dark:bg-gray-700 text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 p-2"
           />
           {filter != '' && filteredPhotos.length === 0 && <p className="text-center text-gray-900 dark:text-gray-200">No photos found with title "{filter}"</p>}
          </div>
          <section className="grid grid-cols-3 gap-x-4 gap-y-6 h-full p-2 place-items-center">
            {(filter != '' ? filteredPhotos : photos).map((photo) => (
              <div className="relative" key={photo.id}>
                <EditForm
                  photo={photo}
                  classes="w-32 h-32 sm:w-52 sm:h-52 p-2 relative overflow-hidden"
                />
                {enabled && (
                  <div className="absolute top-0 bottom-0 left-0 right-0 grid place-items-center bg-black/60 dark:bg-black/40 m-2">
                    {!loadingDelete ? <span onClick={() => setTarget(photo.id)}>
                      {target != "" && target === photo.id ? 
                        <button
                          onClick={() => handleDelete(photo.id)}
                          type="button"
                          className="rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                        >
                          Confirm?
                        </button>
                        :  <TrashIcon className="w-8 h-8 text-red-400 font-bold" />
                      }
                    </span>  :  <LoaderIMG />}
                  </div>
                )}
              </div>
            ))}
          </section>
          {filter != '' && filteredPhotos.length === 0 && <p className="text-center text-gray-900 dark:text-gray-200">No photos found with title "{filter}"</p>}
        </>
      )}
    </>
  );
}
