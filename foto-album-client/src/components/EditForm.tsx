import { useContext, useState } from "react";
import { UrlContext } from "../lib/context/UrlContext";
import { classNames, fieldError } from "../lib/utils/functions";
import {
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { RadioGroup } from "@headlessui/react";
import { UpdateContext } from "../lib/context/UpdateContext";

export default function EditForm({
  photo,
  classes
}: {
  photo: Photo;
  classes: string;
}) {
  const [open, setIsOpen] = useState<boolean>(false);
  const [visibility, setVisibility] = useState(photo.visible);
  const url = useContext(UrlContext);
  const [fields, setFields] = useState<FieldError[]>([]);
  const [[error, errorMessage], setError] = useState<[boolean, string]>([
    false,
    "",
  ]);
  const [categories, setCategories] = useState<string[]>(photo.categories);
  const [newCategory, setNewCategory] = useState<string>("");
  const { update, setUpdate } = useContext(UpdateContext);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const urlToFetch =`api/photos/edit/${photo.id}`
    const formData = new FormData(event.currentTarget);
   
    formData.append("categories", categories.join(","));
    if (categories[0] == "" && categories.length == 1) {
      formData.delete("categories");
    }
    formData.append("visible", visibility.toString());
    const res = await fetch(url + urlToFetch, {
      credentials: "include",
      method: "PUT",
      body: formData,
    });
    const result = await res.json();
    if(result.status == 200){
      setCategories(result.data.categories);
      setIsOpen(false);
      setUpdate(!update);
    } else if (result.error){
      setError([true, result.error]);
      setFields(result.messages);
    }
    
  };

  const handleClose = () => {
    setIsOpen(false);
    setFields([]);
    setError([false, ""]);
    setCategories(photo.categories);
    setNewCategory("");
    setVisibility(photo.visible);
  }
  if(photo.available === false) return <button className={classes}>
  <img
    src={`${url}images/${photo.link}`}
    alt={photo.title + " image"}
    className="opacity-20 brightness-50 w-full h-full object-cover rounded"
  />
 
    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-700 font-bold grid place-items-center">
      {" "}
      <ExclamationTriangleIcon className="w-5 h-5" />{" "}
      <span className="text-xs text-center pt-2">
        Not available
      </span>{" "}
    </span>
</button>

  return (
    <>
      <button className={classes} onClick={() => setIsOpen(true)}>
        <img
          src={`${url}images/${photo.link}`}
          alt={photo.title + " image"}
          className={classNames(
            photo.visible ? "opacity-100" : "opacity-50 brightness-50",
            "w-full h-full object-cover rounded"
          )}
        />
        {!photo.visible && (
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white grid place-items-center">
            {" "}
            <EyeSlashIcon className="w-5 h-5" />{" "}
            <span className="text-xs text-center pt-2">
              Not visible in feed
            </span>{" "}
          </span>
        )}
      </button>
      {open &&
          <div className="fixed top-0 right-0 bottom-0 left-0 z-10 backdrop-blur-sm bg-black/50 grid place-items-center p-10">
            <div className="container max-w-xl mx-auto p-6 bg-white dark:bg-gray-700 text-gray-800 dark:text-white z-10 flex flex-col gap-6 rounded-lg shadow-xl max-h-[95%] overflow-y-auto">
              <button
                className="self-end text-gray-800 dark:text-white"
                onClick={handleClose}
              >
                <XMarkIcon className="w-8 h-8" />
              </button>
              <h1 className="font-medium text-2xl">Edit your photo</h1>
              {error && <p className="text-red-500 text-center">{errorMessage}</p>}
              <form
                onSubmit={(event) => handleSave(event)}
                className="container max-w-xl mx-auto"
              >
                <img
                  src={url + "images/" + photo.link}
                  alt="photo"
                  className="w-full h-full max-w-[400px] max-h-[400px] mx-auto"
                />
                <div className="pt-3">
                  <label
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-white/80"
                    htmlFor="file"
                  >
                    Image
                  </label>
                  <input className="text-sm file:mr-5 file:py-2.5 file:rounded-l-md file:px-3 file:text-sm file:bg-gray-50 dark:file:bg-gray-600 dark:file:text-gray-100 file:text-gray-700 hover:file:cursor-pointer file:border-none ring-2 rounded-md dark:ring-gray-500 ring-gray-200 mt-2 text-gray-800 dark:text-gray-200 w-full" name="file" type="file" />
                </div>
                <div className="pt-3">
                  <label
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-white/80"
                    htmlFor="title"
                  >
                    Title
                  </label>
                  <input
                    className={classNames(
                      fieldError("title", fields) ? "ring-red-500" : "ring-gray-300",
                      "block w-full rounded-md border-0 py-2.5 px-2 dark:bg-gray-700 text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    )}
                    name="title"
                    type="text"
                    defaultValue={photo.title}
                  />
                  {error && <p className="text-red-500 text-center">{fieldError("title", fields)}</p>}
                </div>
                <div className="pt-3">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium leading-6 text-gray-900 dark:text-white/80"
                  >
                    Description
                  </label>
                  <div className="mt-2">
                    <textarea
                      rows={4}
                      name="description"
                      id="description"
                      className={classNames(
                        fieldError("description", fields) ? "ring-red-500" : "ring-gray-300",
                        "p-2 block w-full rounded-md border-0 py-1.5 dark:bg-gray-700 text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      )}
                      defaultValue={photo.description}
                    />
                    {error && <p className="text-red-500 text-center">{fieldError("description", fields)}</p>}
                  </div>
                </div>
                <div className="pt-3 mt-2">
                  <RadioGroup
                    className={"flex items-center gap-4 justify-between"}
                    value={visibility}
                    onChange={setVisibility}
                  >
                    <RadioGroup.Label className="block text-sm font-medium leading-6 text-gray-900 dark:text-white/80">
                      Visibility of your photo
                    </RadioGroup.Label>
                    <div className="flex items-center gap-5">
                      <RadioGroup.Option
                        value={false}
                        defaultChecked={visibility}
                        className={({ checked }) =>
                          classNames(
                            checked
                              ? "ring-2 bg-red-600 text-white font-bold ring-red-200"
                              : "bg-red-200 text-gray-600   ",
                            "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none w-10 h-10"
                          )
                        }
                      >
                        <EyeSlashIcon className="w-5 h-5" />
                      </RadioGroup.Option>
                      <RadioGroup.Option
                        defaultChecked={visibility}
                        value={true}
                        className={({ checked }) =>
                          classNames(
                            checked
                              ? "ring-2 bg-blue-600 text-white font-bold"
                              : "bg-blue-200 text-gray-600",
                            "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none w-10 h-10"
                          )
                        }
                      >
                        <EyeIcon className="w-5 h-5" />
                      </RadioGroup.Option>
                    </div>
                  </RadioGroup>
                </div>
                <div className="pt-3">
                  <label
                    htmlFor="categories"
                    className="mb-2 block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200"
                  >
                    Categories
                  </label>
                  {categories.length === 0 ? (
                    <small className="text-red-400 font-medium">
                      No categories added.{" "}
                      <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                        general
                      </span>{" "}
                      will be added.{" "}
                    </small>
                  ) : (
                    categories.map((category) => {
                      return (
                        <span
                          key={category}
                          onClick={() =>
                            setCategories(
                              categories.filter((cat) => cat !== category)
                            )
                          }
                          className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 mr-2"
                        >
                          {category}
                        </span>
                      );
                    })
                  )}
                  <div className="flex items-center justify-between mt-2 gap-2">
                    <input
                      className="mt-2 flex-1 block w-full rounded-md border-0 py-1.5 px-2 dark:bg-gray-700 text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      name="categoriesNew"
                      type="text"
                      placeholder="Add a category"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    />
                    <span
                      onClick={() => {
                        if (
                          !categories.includes(newCategory.trim().toLowerCase())
                        ) {
                          setCategories([
                            ...categories,
                            newCategory.toLowerCase().trim(),
                          ]);
                        }
                        setNewCategory("");
                      }}
                      className="rounded-full bg-blue-600 p-1.5 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                      <PlusIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2"></div>
                </div>

                <div className="w-full flex justify-end items-center gap-2 pt-6">
                  <button
                    type="submit"
                    className="rounded-md bg-blue-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleClose}
                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        }
    </>
  );
}
