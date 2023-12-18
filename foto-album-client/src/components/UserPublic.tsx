import { useContext, useEffect, useState } from "react";
import { redirect, useNavigate, useParams } from "react-router-dom";
import { UrlContext } from "../lib/context/UrlContext";
import Loader from "./Loader";
import ErrorPage from "../error-page";
import {
  PhotoIcon,
  RectangleGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Photo from "./Photo";
import { Switch } from "@headlessui/react";
import { classNames } from "../lib/utils/functions";
import { UpdateContext } from "../lib/context/UpdateContext";

export default function UserPublic() {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState<boolean>(true);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const userID = useParams<{ id: string }>();
  const url = useContext(UrlContext);
  const navigate = useNavigate();
  const [enabled, setEnabled] = useState(false);
  const [fullsize, setFullsize] = useState(false);
  const [fullsizePhoto, setFullsizePhoto] = useState<Photo>();
  const { update } = useContext(UpdateContext)

  useEffect(() => {
    async function getUser() {
      const res = await fetch(url + "user/user-public/" + userID.id);
      const result = await res.json();
      if (result.error) {
        navigate("/photos");
      }
      setUser(result.data);
    }

    async function getUserPhoto() {
      if (!userID) {
        redirect("/photos");
      }
      const res = await fetch(url + "api/photos/user-public/" + userID.id, {
        credentials: "include",
      });
      const result = await res.json();
      if (result.data) {
        setPhotos(result.data);
      } else {
        setPhotos([]);
      }
      setLoading(false);
    }
    getUser();
    getUserPhoto();
  }, [url, userID, update]);

  if (loading) return <Loader />;
  if (!user) return <ErrorPage />;
  return (
    <section className="text-gray-900 dark:text-white flex-1 w-full h-full p-4">
      <div className="flex justify-between items-center pt-6 flex-wrap pb-10">
        <div className="flex items-center gap-4">
          <span className="w-12 h-12 bg-gray-400 rounded-full grid place-items-center text-2xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </span>
          <h1 className="text-4xl">{user.name}</h1>
        </div>
        <div className="flex items-center gap-3 self-end">
          <small className="flex items-center gap-1">
            {" "}
            <PhotoIcon className="w-6 h-6" /> {photos.length} photos
          </small>
        </div>
      </div>
      <div className="flex justify-end items-center gap-2">
        <PhotoIcon className="w-6 h-6" />
        <Switch
          checked={enabled}
          onChange={setEnabled}
          className={classNames(
            enabled ? "bg-green-600" : "bg-gray-200 dark:bg-gray-600",
            "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
          )}
        >
          <span className="sr-only">Use setting</span>
          <span
            aria-hidden="true"
            className={classNames(
              enabled ? "translate-x-5" : "translate-x-0",
              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
            )}
          />
        </Switch>
        <RectangleGroupIcon className="w-6 h-6" />
      </div>

      <div>
        {photos.length === 0 ? (
          <div> No photo, at the moment.</div>
        ) : enabled ? (
          <div className="mt-6 grid grid-cols-3 md:grid-cols-4 place-items-center gap-y-2">
            {photos.map((photo) => (
              <div key={photo.id}>
                <img
                  onClick={() => {
                    setFullsizePhoto(photo);
                    setFullsize(true);
                  }}
                  className="w-32 h-32 object-cover rounded shadow-md"
                  src={url + "images/" + photo.link}
                  alt=""
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full h-full p-2 place-items-center">
            {photos.map((photo) => (
              <Photo key={photo.id} photo={photo} />
            ))}
          </div>
        )}
      </div>
      {fullsize && fullsizePhoto && (
        <div className="fixed top-0 right-0 bottom-0 left-0 bg-black/80 grid place-items-center h-full">
          <div className="max-h-[90%] overscroll-y-auto">
            <div className="text-end">
              <button onClick={() => {
                setFullsize(false)
                setFullsizePhoto(undefined)
              }} className="mx-auto">
                <XMarkIcon className="w-10 h-10 text-white" />
              </button>
            </div>
            <div className="p-2 h-full overflow-y-auto">
              <img
                onClick={() => {}}
                className="w-full h-full max-h-[600px] object-cover rounded shadow-md"
                src={url + "images/" + fullsizePhoto.link}
                alt=""
              />
              <div className="text-white pt-2">
                <h2 className="font-bold pb-1">{fullsizePhoto.title}</h2>
                <p className="font-light">{fullsizePhoto.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
