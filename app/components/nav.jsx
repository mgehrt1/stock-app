"use client";

import Link from "next/link";
import "app/globals.css";
import "app/bootstrap.min.css";
import Image from "next/image";
import { UserAuth } from "@app/context/AuthContext";
import loader from "./loader";

import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  getAuth,
} from "firebase/auth";
import { useEffect, useState, Fragment } from "react";
import { auth, googleProvider } from "app/firebase-config.js";
import { Dialog, Disclosure, Popover, Transition } from "@headlessui/react";
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
  EyeIcon,
  NewspaperIcon,
  PresentationChartLineIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  PhoneIcon,
  PlayCircleIcon,
} from "@heroicons/react/20/solid";
import { db } from "@app/firebase-config";
import { getDocs, collection } from "firebase/firestore";
import { useHref } from "react-router-dom";

{
  /* STOCK TAB OPTIONS */
}
const products = [
  {
    name: "Watchlists",
    // description: "Get a better understanding of your traffic",
    href: "#",
    icon: EyeIcon,
  },
  {
    name: "News",
    // description: "Speak directly to your customers",
    href: "#",
    icon: NewspaperIcon,
  },
  {
    name: "Markets",
    // description: "Your customers’ data will be safe and secure",
    href: "#",
    icon: PresentationChartLineIcon,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Nav() {
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState([]);
  // const [user, setUser] = useState({});
  const { user, signInWithGoogle, logout } = UserAuth();
  const [loading, setLoading] = useState(true);

  const userCollectionRef = collection(db, "users");

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuth();
  }, [user]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await getDocs(userCollectionRef);
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        console.log(filteredData);
        setUserInfo(filteredData);
      } catch (err) {
        console.log(err);
      }
    };

    getUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (err) {
      console.log(err);
    }
  };

  const logoutMobile = async () => {
    try {
      await signOut(auth);
      setMobileMenuOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const userDropdown = [
    {
      name: "My Profile",
    },
    {
      name: "Logout",
      href: "/",
    },
  ];

  /* useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);
*/
  return (
    <header className="bg-stone-100">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Rohrs Stock's</span>
            <svg
              fill="#000000"
              width="60px"
              height="60px"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
              className="shadow-lg nav-start-add-on nav-start-animate"
            >
              <path
                d="M0 14h16v2H0v-2zm8.5-8l4-4H11V0h5v5h-2V3.5L9.5 8l-1 1-2-2-5 5L0 10.5 6.5 4 8 5.5l.5.5z"
                fillRule="evenodd"
              />
            </svg>
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <Popover.Group className="hidden lg:flex lg:gap-x-12 bg-stone-100 shadow-lg  nav-md-add-on nav-md-animate">
          <Popover className="relative">
            <Popover.Button className="flex items-center gap-x-1 text-base font-semibold leading-6 text-gray-900">
              Stocks
              <ChevronDownIcon
                className="h-5 w-5 flex-none text-gray-400"
                aria-hidden="true"
              />
            </Popover.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                <div className="p-4">
                  {products.map((item) => (
                    <div
                      key={item.name}
                      className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
                    >
                      <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                        <item.icon
                          className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="flex-auto">
                        <a
                          href={item.href}
                          className="block font-semibold text-gray-900"
                        >
                          {item.name}
                          <span className="absolute inset-0" />
                        </a>
                        <p className="mt-1 text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50"></div>
              </Popover.Panel>
            </Transition>
          </Popover>

          <a
            href="/explore"
            className="text-base font-semibold leading-6 text-gray-900"
          >
            Explore
          </a>
          <a
            href="/user-portfolio"
            className="text-base font-semibold leading-6 text-gray-900"
          >
            Portfolio
          </a>
          <a
            href="/about"
            className="text-base font-semibold leading-6 text-gray-900"
          >
            About
          </a>
        </Popover.Group>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {loading ? null : !user ? (
            <a
              href="/sign-in"
              className="text-lg font-semibold leading-6 text-gray-900"
            >
              Log in <span aria-hidden="true">&rarr;</span>
            </a>
          ) : (
            <div>
              <Popover.Group className="hidden lg:flex lg:gap-x-12 bg-stone-100 shadow-lg  nav-md-add-on nav-md-animate">
                <Popover className="relative">
                  <Popover.Button className="flex items-center gap-x-0 text-base font-semibold leading-6 text-gray-900">
                    <div>
                      {user?.photoURL == null ? (
                        <div className="nav-login-text">
                          Welcome,
                          {userInfo.map((userInfo) => (
                            <div key={userInfo.email}>
                              {user?.email == userInfo.email
                                ? userInfo.username
                                : ""}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>
                          {
                            <img
                              src={user?.photoURL}
                              height={"40"}
                              width={"40"}
                              className="user-pic"
                            ></img>
                          }
                        </p>
                      )}
                    </div>
                    <ChevronDownIcon
                      className="h-5 w-5 flex-none text-gray-400"
                      aria-hidden="true"
                    />
                  </Popover.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel className=" absolute -left-0 top-full z-10 mt-3  rounded-3xl bg-white">
                      <div className="p-3">
                        {userDropdown.map((item) => (
                          <div key={item.name} className="">
                            <div className=""></div>
                            <div className="">
                              <a
                                href={
                                  item.name == "My Profile" ? "/profile" : "/"
                                }
                                onClick={
                                  item.name == "Logout"
                                    ? handleSignOut
                                    : undefined
                                }
                                className="block font-semibold text-gray-900"
                              >
                                {item.name}
                                <span className="absolu" />
                              </a>
                              <br />
                              <p className="mt-1 text-gray-600"></p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Popover.Panel>
                  </Transition>
                </Popover>
              </Popover.Group>
            </div>
          )}
        </div>
      </nav>

      {/* ---------------------------------------------------------MOBILE SECTION--------------------------------------------------------- */}

      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Rohrs Stock</span>
              <svg
                fill="#000000"
                width="30px"
                height="30px"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 14h16v2H0v-2zm8.5-8l4-4H11V0h5v5h-2V3.5L9.5 8l-1 1-2-2-5 5L0 10.5 6.5 4 8 5.5l.5.5z"
                  fillRule="evenodd"
                />
              </svg>
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          {/* DROPDOWN NAVBAR OPTIONS */}
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Disclosure as="div" className="-mx-3">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                        Info
                        <ChevronDownIcon
                          className={classNames(
                            open ? "rotate-180" : "",
                            "h-5 w-5 flex-none"
                          )}
                          aria-hidden="true"
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="mt-2 space-y-2">
                        {[...products].map((item) => (
                          <Disclosure.Button
                            key={item.name}
                            as="a"
                            href={item.href}
                            className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                          >
                            {item.name}
                          </Disclosure.Button>
                        ))}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                <a
                  href="/explore"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Explore
                </a>
                <a
                  href="/"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Portfolio
                </a>
                <a
                  href="/about"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  About
                </a>
              </div>
              {/* AUTH SECTION */}
              <div className="py-6">
                {user?.email == null ? (
                  <a
                    href="/sign-in"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Log in
                  </a>
                ) : (
                  <a
                    href=""
                    onClick={logoutMobile}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Log out
                  </a>
                )}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
