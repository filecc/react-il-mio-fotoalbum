import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";


export default function Layout({ children }: { children: React.ReactNode }) {
    const darkModePreference = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const [darkModeActive, setDarkModeActive] = useState(darkModePreference);
   
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (darkModePreference) {
            setDarkModeActive(true)
        } else {
            setDarkModeActive(false)
        }
    })

  return (
    <main className={`${darkModeActive ? 'dark text-foreground bg-background' : ''}`}>
      <Navbar />
      {children}
    </main>
  );
}
