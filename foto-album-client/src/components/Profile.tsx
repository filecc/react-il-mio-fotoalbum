import { useContext, useEffect, useState } from "react";
import Loader from "./Loader";
import { UrlContext } from "../lib/context/UrlContext";
import { redirect } from "react-router-dom";
import { UpdateContext } from "../lib/context/UpdateContext";
import EditForm from "./EditForm";
import AddForm from "./AddForm";

export default function Profile() {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState<boolean>(true);
  const { update } = useContext(UpdateContext);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const url = useContext(UrlContext);

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
    console.log('updating')
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

  if (loading) return <Loader />;

  return (
    <>
      {user && (
        <div className="flex items-center justify-between w-full pr-6">
          <div className="flex items-center gap-2 self-start p-6">
          <span className="w-10 h-10 bg-gray-400 rounded-full grid place-items-center font-bold">
            {user.name.charAt(0).toUpperCase()}
          </span>
          <small className="font-base font-bold">{user.name}</small>
        </div>
        <AddForm />
        </div>
        
      )}
      {photos.length === 0 ? (
        <p>No photos</p>
      ) : (
        <>
          <p className="font-bold">Your Feed</p>
          <section className="grid grid-cols-3 gap-x-4 gap-y-6 h-full p-2 place-items-center">
            {photos.map((photo) => (
              <EditForm
                photo={photo}
                key={photo.id}
                classes="w-32 h-32 sm:w-52 sm:h-52 p-2 relative overflow-hidden"
              />
              
            ))}
          </section>
        </>
      )}
    </>
  );
}
