import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../lib/context/UserContext";
import { classNames, fieldError } from "../lib/utils/functions";

export default function Login() {
  const [[error, errorMessage], setError] = useState<[boolean, string]>([
    false,
    ""
  ]);
  const [fields, setFields] = useState([])
  const { setIsLogged } = useContext(UserContext);
  const navigate = useNavigate()

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    setError([false, ""]);
    setFields([])
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const res = await fetch("http://localhost:4000/user/login", {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });
    const result = await res.json();
   console.log(result)
    if(result.code != 200){
      setError([true, result.error]);
      setFields(result.messages)
      setIsLogged(false)
      return;
    }
    setIsLogged(true);
    navigate("/profile")
  };


  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={classNames(
                    fieldError("email", fields) ? "ring-red-600" : "",
                    "bg-white dark:bg-gray-700 px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  )
                  }
                />
                {fieldError("email", fields) && <p className="text-red-600 pt-1 text-center"> {fieldError("email", fields)}</p>}
              </div>
              
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900 dark:text-white"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className={
                    classNames(
                      fieldError("password", fields) ? "border-red-600" : "",
                      "bg-white dark:bg-gray-700 px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    )
                  }
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Sign in
              </button>
            </div>
          </form>
          {error ? <p className="text-red-600 pt-3 text-center"> {errorMessage}</p> : ''}
        </div>
      </div>
    </>
  );
}
