import { useContext, useEffect, useState } from "react";
import { UrlContext } from "../../lib/context/UrlContext";
import Loader from "../Loader";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  CheckBadgeIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { classNames } from "../../lib/utils/functions";
import { Switch } from "@headlessui/react";

export default function Dashboard() {
  const [loading, setLoading] = useState<boolean>(true);
  const [perPage, setPerPage] = useState<number>(3);
  const [actualPage, setActualPage] = useState<string | null>();
  const [info, setInfo] = useState<Pagination>();

  const url = useContext(UrlContext);
  useEffect(() => {
    setLoading(true);
    const getPhotos = async () => {
      setActualPage(
        actualPage ? actualPage : "admin/photos?startIndex=0&perPage=" + perPage
      );
      const res = await fetch(url + actualPage, {
        credentials: "include",
      });
      const result = await res.json();
      console.log(result);
      if (result.code == 200) {
        setInfo(result);
      }
      setLoading(false);
    };
    getPhotos();
  }, [url, actualPage, perPage]);

  const handleAvailability = async (id: string) => {
    console.log(id)
  }

  if (loading) return <Loader />;
  if (!info) return <div>no photo to display</div>;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Welcome Admin.
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Here's a list of all photos in the feeds.
          </p>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <p>Results per Page</p>
        <div className="flex items-center gap-2">
          {[1, 3, 5, 10].map((item) => {
            return (
              <button
                className={classNames(
                  item === perPage
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50",
                  "w-12 h-12 grid place-items-center rounded disabled:bg-gray-200 transition-all duration-300"
                )}
                onClick={() => {
                  setPerPage(item);
                  setActualPage(null);
                }}
                key={item + Math.random() * 500}
                disabled={item > info.total ? true : false}
              >
                {item}
              </button>
            );
          })}
        </div>

        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Photo
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Posted
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Available
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Visible
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Author email
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {info.data.map((photo) => (
                  <tr key={photo.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      <img
                        className="w-16 h-16 rounded"
                        src={url + "images/" + photo.link}
                        alt={photo.title}
                      />
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {photo.title}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {new Date(photo.created_at).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {photo.available ? (
                        <CheckBadgeIcon className="h-6 w-6 text-green-600" />
                      ) : (
                        <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {photo.visible ? (
                        <CheckBadgeIcon className="h-6 w-6 text-green-600" />
                      ) : (
                        <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {photo.author.email}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <Switch
                        checked={photo.available}
                        onChange={() => {
                          const newData = info.data.map((item) => {
                            if (item.id === photo.id) {
                              item.available = !item.available;
                            }
                            return item;
                          })
                          setInfo({
                            ...info, 
                            data: newData
                          })
                          handleAvailability(photo.id)
                        }}
                        className={classNames(
                          photo.available ? "bg-indigo-600" : "bg-gray-200",
                          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={classNames(
                            photo.available ? "translate-x-5" : "translate-x-0",
                            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                          )}
                        />
                      </Switch>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-center">
              {info.total > perPage && (
                <div className="flex justify-center items-center gap-2">
                  <button
                    disabled={!info.previousPage}
                    onClick={() => setActualPage(info.previousPage)}
                  >
                    <ArrowLeftCircleIcon
                      className={classNames(
                        info.previousPage ? "text-blue-500" : "text-gray-300",
                        "w-8 h-8"
                      )}
                    />
                  </button>
                  <button
                    disabled={!info.nextPage}
                    onClick={() => setActualPage(info.nextPage)}
                  >
                    <ArrowRightCircleIcon
                      className={classNames(
                        info.nextPage ? "text-blue-500" : "text-gray-300",
                        "w-8 h-8"
                      )}
                    />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
