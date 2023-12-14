import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";

function classNames (...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}
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
    <main className={classNames(
        darkModeActive ? 'dark text-foreground bg-background' : '',
        'min-h-[100dvh] w-full flex flex-col items-center'
    )}>
      <Navbar />
      {children}
    </main>
  );
}
