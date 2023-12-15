import { useContext } from "react";
import { UrlContext } from "../lib/context/UrlContext";
import { HeartIcon } from "@heroicons/react/24/outline";

export default function Photo({ photo }: { photo: Photo }) {
  const url = useContext(UrlContext);
  const posted =
    Math.round(
      (Date.now() - new Date(photo.created_at).getTime()) / 1000 / 60 / 60 / 24
    ) === 0
      ? "today"
      : Math.round(
          (Date.now() - new Date(photo.created_at).getTime()) /
            1000 /
            60 /
            60 /
            24
        ) === 1
      ? "yesterday"
      : Math.round(
          (Date.now() - new Date(photo.created_at).getTime()) /
            1000 /
            60 /
            60 /
            24
        ) + " days ago";
  return (
    <article className="flex flex-col justify-between h-full rounded-b-md p-2">
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <span className="w-10 h-10 bg-gray-400 rounded-full grid place-items-center font-bold">{photo.author.name.charAt(0).toUpperCase()}</span>
          <small className="font-base font-bold">
            {photo.author.name}
          </small>
        </div>

        <small>posted {posted}</small>
      </div>

      <img
        className="w-full h-full max-h-[200px] object-cover"
        src={`${url}images/${photo.link}`}
        alt={photo.title + " image"}
      />
      <div className="pt-2 flex items-center justify-start gap-2">
            <HeartIcon className="w-5 h-5 text-red-500" />
            <span className="text-sm">{Math.floor(Math.random()*1000)} likes</span>
      </div>
      <div className="pt-4 text-sm">
        <p className="font-medium">{photo.title}</p>
        <p className="font-light">
          {photo.description.length > 50
            ? photo.description.slice(0, 50) + "..."
            : photo.description}
        </p>
        <section className="flex items-center gap-1">
          {photo.categories.map((category) => {
            return (
              <span key={category} className="font-medium text-blue-500">
                #{category}
              </span>
            );
          })}
        </section>
      </div>
    </article>
  );
}
