import {  useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { UserContext } from "./lib/context/UserContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isLogged, setIsLogged] = useState(false);
  


  useEffect(() => {
    async function isUserLoggedIn() {
      const res = await fetch("http://localhost:4000/user/isLogged");
      const data = await res.json();
     
      if (data.result) {
        setIsLogged(true);
      } else {
        setIsLogged(false);
      }
    }

    isUserLoggedIn();
  });

  return (
    <UserContext.Provider value={isLogged}>
       <Navbar />
      <main
        className="min-h-[calc(100dvh-64px)] w-full flex flex-col items-center bg-white dark:bg-gray-900"
      >
        {children}
      </main>
    </UserContext.Provider>
  );
}
