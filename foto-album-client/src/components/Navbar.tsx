import { useContext } from "react";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { classNames } from "../lib/utils/functions";
import { UserContext } from "../lib/context/UserContext";

export default function Example() {
  const { isLogged } = useContext(UserContext);
  
  
  const path = window.location.pathname;

  const menuItems = [
    { name: "Home", href: "/", current: path === "/", visible: true },
    {
      name: "Photos",
      href: "/photos",
      current: path === "/photos",
      visible: true,
    },
    {
      name: "Profile",
      href: "/profile",
      current: path === "/profile",
      visible: isLogged,
    },
    {
      name: "Login",
      href: "/login",
      current: path === "/login",
      visible: !isLogged,
    },
    {
      name: "Logout",
      href: "/logout",
      current: path === "/logout",
      visible: isLogged,
    },
  ];
  return (
    <Disclosure as="nav" className=" bg-white dark:bg-gray-800 shadow">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex justify-between">
                <div className="flex flex-shrink-0 items-center">
                  <p className="text-gray-900 dark:text-gray-200">
                    The Photo-Blog
                  </p>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
                  {menuItems.map((item) => {
                    if (item.visible) {
                      return (
                        <Disclosure.Button
                          key={item.name + "navmobile"}
                          as="a"
                          href={item.href}
                          className={classNames(
                            item.current
                              ? "bg-blue-600 text-white"
                              : "dark:text-gray-300 hover:bg-gray-700 hover:text-white bg-gray-200 dark:bg-gray-900",
                            "block rounded-md  px-3 py-2 text-sm font-medium"
                          )}
                        >
                          {item.name}
                        </Disclosure.Button>
                      );
                    }
                  })}
                </div>
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-500 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {menuItems.map((item) => {
                if (item.visible) {
                  return (
                    <Disclosure.Button
                      key={item.name + "navmobile"}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-blue-50 border-blue-500 text-blue-700"
                          : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700",
                        "block border-l-4  py-2 pl-3 pr-4 text-base"
                      )}
                    >
                      {item.name}
                    </Disclosure.Button>
                  );
                }
              })}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
