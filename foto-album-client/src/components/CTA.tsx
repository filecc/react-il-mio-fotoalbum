import { useContext, useRef, useState } from "react";
import { UrlContext } from "../lib/context/UrlContext";
import { AnimatePresence, motion } from "framer-motion";

export default function CTA() {
  const [loading, setLoading] = useState<boolean>(false);
  const url = useContext(UrlContext);
  const refForm = useRef<HTMLFormElement>(null);
  const [send, setSend] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const handleMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await fetch(url + "service/message", {
      method: "POST",
      body: formData,
    });
    const result = await res.json();
    if(result.code == 200){
        setSend(true);
    } else {
        setError(result.error)
    }
    if (refForm.current) refForm.current.reset();
    setLoading(false);
    setTimeout(() => {
      setSend(false);
      setError(undefined);
    }, 2000);
  };
  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gray-800 px-6 py-24 shadow-2xl sm:rounded-3xl sm:px-24 xl:py-32">
          <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Leave us a message.
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-lg leading-8 text-gray-300 dark:text-gray-400">
            Reprehenderit ad esse et non officia in nulla. Id proident tempor
            incididunt nostrud nulla et culpa.
          </p>
          <AnimatePresence>
            {send && <motion.p 
                initial={{opacity: 0}} 
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                className="text-green-500 text-center py-2">Message sent!</motion.p>}
          </AnimatePresence>
          <AnimatePresence>
            {error && <motion.p 
                initial={{opacity: 0}} 
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                className="text-red-500 text-center py-2">Something went wrong! Try again later.</motion.p>}
          </AnimatePresence>
          <form
            ref={refForm}
            className="mx-auto mt-10 flex flex-col max-w-md gap-x-4 gap-y-4 items-center sm:flex-row"
            onSubmit={handleMessage}
          >
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full min-w-0 flex-auto rounded-md border-0 bg-white/5 dark:bg-gray-800/10 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 dark:ring-white/70 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
              placeholder="Enter your email"
            />
            <label htmlFor="message" className="sr-only">
              Email address
            </label>
            <input
              name="message"
              type="text"
              required
              className="w-full min-w-0 flex-auto rounded-md border-0 bg-white/5 dark:bg-gray-800/10 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 dark:ring-white/70 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6"
              placeholder="Enter your message"
            />
            <button
              type="submit"
              className="w-full sm:w-fit rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2"
            aria-hidden="true"
          >
            <circle
              cx={512}
              cy={512}
              r={512}
              fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
              fillOpacity="0.7"
            />
            <defs>
              <radialGradient
                id="759c1415-0410-454c-8f7c-9a820de03641"
                cx={0}
                cy={0}
                r={1}
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(512 512) rotate(90) scale(512)"
              >
                <stop stopColor="#7775D6" />
                <stop offset={1} stopColor="#E935C1" stopOpacity={0} />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}
