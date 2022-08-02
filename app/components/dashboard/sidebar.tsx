import { Disclosure, Transition } from "@headlessui/react";
import {
  ChartPieIcon,
  ChevronRightIcon,
  CogIcon,
  UserIcon,
} from "@heroicons/react/outline";
import type { ComponentProps } from "react";
import { NavLink, useMatches } from "@remix-run/react";

import { Logo } from "./logo";

export const Sidebar = () => {
  const matches = useMatches();

  const LinkClasses =
    "relative flex w-full items-center z-10 rounded-xl px-5 py-4 hover:bg-slate-100";
  const ActiveLinkClasses =
    "relative flex w-full items-center z-10 rounded-xl px-5 py-4 bg-slate-100";

  const ChildLinkClasses =
    "ml-6 flex rounded-xl px-5 py-3 text-slate-500 hover:bg-slate-100";
  const ActiveChildLinkClasses =
    "ml-6 flex rounded-xl px-5 py-3 text-slate-500 bg-slate-100";

  return (
    <div className="flex h-full w-full flex-col space-y-6 overflow-y-auto rounded-2xl bg-white shadow-xl">
      <div className="flex items-center space-x-2 p-6">
        <Logo className="h-10 w-10" />
        <span className="text-2xl font-medium text-slate-800">Niobium</span>
      </div>

      <div className="flex-auto">
        <ul className="flex w-full flex-col space-y-2 p-4">
          {menu.map((item, i) => {
            if (!item.children) {
              return (
                <li key={item.title}>
                  <NavLink
                    to={item.url}
                    className={({ isActive }) =>
                      isActive ? ActiveLinkClasses : LinkClasses
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          className={`mr-2 h-4 w-4 ${
                            isActive ? "text-slate-700" : "text-slate-500"
                          }`}
                        />
                        <span
                          className={`font-normal ${
                            isActive
                              ? "font-medium text-slate-700"
                              : "text-slate-500"
                          }`}
                        >
                          {item.title}
                        </span>
                      </>
                    )}
                  </NavLink>
                </li>
              );
            }
            return (
              <Disclosure
                defaultOpen={matches[2].pathname.includes(item.url)}
                key={item.title}
                as="li"
                className="overflow-hidden"
              >
                {({ open }) => (
                  <>
                    <Disclosure.Button
                      className={`${
                        matches[2].pathname.includes(item.url)
                          ? ActiveLinkClasses
                          : LinkClasses
                      }`}
                    >
                      <>
                        <item.icon
                          className={`mr-2 h-4 w-4 ${
                            matches[2].pathname.includes(item.url)
                              ? "text-slate-700"
                              : "text-slate-500"
                          }`}
                        />
                        <span
                          className={`font-normal ${
                            matches[2].pathname.includes(item.url)
                              ? "font-medium text-slate-700"
                              : "text-slate-500"
                          }`}
                        >
                          {item.title}
                        </span>
                        <ChevronRightIcon
                          className={`ml-auto h-4 w-4 text-slate-500 transition${
                            open ? " rotate-90 transform" : ""
                          }`}
                        />
                      </>
                    </Disclosure.Button>
                    <Transition
                      enter="transition duration-200 ease-out"
                      enterFrom="transform -translate-y-full opacity-0"
                      enterTo="transform translate-y-0 opacity-100"
                      leave="transition duration-200 ease-out"
                      leaveFrom="transform translate-y-0 opacity-100"
                      leaveTo="transform -translate-y-full opacity-0"
                    >
                      <Disclosure.Panel
                        as="ul"
                        className="mt-1 flex flex-col space-y-2"
                      >
                        {item.children &&
                          item.children.map((child) => (
                            <li key={child.title}>
                              <NavLink
                                to={child.url}
                                end
                                className={({ isActive }) =>
                                  isActive
                                    ? ActiveChildLinkClasses
                                    : ChildLinkClasses
                                }
                              >
                                {({ isActive }) => (
                                  <span
                                    className={`font-normal ${
                                      isActive
                                        ? "font-medium text-slate-700"
                                        : "text-slate-500"
                                    }`}
                                  >
                                    {child.title}
                                  </span>
                                )}
                              </NavLink>
                            </li>
                          ))}
                      </Disclosure.Panel>
                    </Transition>
                  </>
                )}
              </Disclosure>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

type Menu = {
  title: string;
  url: string;
  icon: (props: ComponentProps<"svg">) => JSX.Element;
  children?: Array<{ title: string; url: string }>;
};

const menu: Menu[] = [
  {
    title: "Dashboard",
    url: "main",
    icon: ChartPieIcon,
  },
  {
    title: "Users",
    url: "users",
    icon: UserIcon,
  },
  {
    title: "Settings",
    url: "settings",
    icon: CogIcon,
    children: [
      {
        title: "Main",
        url: "settings",
      },
      {
        title: "Account",
        url: "settings/account",
      },
    ],
  },
];
