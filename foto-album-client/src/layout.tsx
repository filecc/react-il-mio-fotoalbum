import { useContext, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { UserContext } from "./lib/context/UserContext";
import { UpdateContext } from "./lib/context/UpdateContext";
import { UrlContext } from "./lib/context/UrlContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isLogged, setIsLogged] = useState(false);
  const [update, setUpdate] = useState(false);
  const [user_id, setUser_id] = useState<string>('');
  const url = useContext(UrlContext);
  useEffect(() => {
    async function isUserLoggedIn() {
      const res = await fetch(url + "user/isLogged", {
        credentials: "include",
      });
      const data = await res.json();

      if (data.result) {
        setIsLogged(true);
      } else {
        setIsLogged(false);
      }
    }
    async function getUserDetail(){
      const res = await fetch(url + "user/userDetails", {
        credentials: "include"
      })
      const result = await res.json()
      if(result.data){
        setUser_id(result.data.id)
      }
    }
    getUserDetail()
    isUserLoggedIn();
  });

  return (
    <UpdateContext.Provider value={{ update, setUpdate }}>
      <UrlContext.Provider value={url}>
        <UserContext.Provider
          value={{
            isLogged,
            setIsLogged,
            user_id
          }}
        >
          <Navbar />
          <main className="min-h-[calc(100dvh-64px)] w-full flex flex-col items-center bg-white dark:bg-gray-900 pb-10">
            {children}
          </main>
        </UserContext.Provider>
      </UrlContext.Provider>
    </UpdateContext.Provider>
  );
}
