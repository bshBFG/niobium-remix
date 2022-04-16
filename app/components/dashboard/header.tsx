import { Form, Link } from "remix";
import {
  BellIcon,
  CogIcon,
  LogoutIcon,
  MenuAlt2Icon,
  PencilAltIcon,
} from "@heroicons/react/outline";
import { Popover } from "@headlessui/react";

import { Image } from "../image";
import defaultAvatar from "~/components/dashboard/images/default-avatar.jpg";
import { getFullNameOrNull, useOptionalUser } from "~/utils/utils";
import { useDispatchSidebar } from "./sidebar-context";

export const Header = () => {
  const user = useOptionalUser();
  const dispatchSidebar = useDispatchSidebar();

  return (
    <div className="flex h-16 w-full items-center justify-between rounded-2xl px-4 py-3">
      <button
        onClick={() => dispatchSidebar({ type: "TOGGLE_SIDEBAR" })}
        className="grid h-8 w-8 place-content-center rounded-md text-slate-500 hover:bg-slate-200 lg:hidden"
      >
        <MenuAlt2Icon className="h-6 w-6" />
      </button>

      <div className="flex flex-auto items-center justify-end space-x-2">
        <button className="grid h-8 w-8 place-content-center rounded-md text-slate-500 hover:bg-slate-200">
          <CogIcon className="h-6 w-6" />
        </button>

        <button className="grid h-8 w-8 place-content-center rounded-md text-slate-500 hover:bg-slate-200">
          <BellIcon className="h-6 w-6" />
        </button>

        <Popover className="relative">
          <Popover.Button className="overflow-hidden rounded-xl shadow-lg">
            <Image
              src={user?.profile?.image || defaultAvatar}
              width={40}
              height={40}
            />
          </Popover.Button>

          <Popover.Panel className="container absolute right-0 z-10 mt-1 mr-1 flex h-max w-80 overflow-y-auto overflow-x-hidden rounded-xl bg-white drop-shadow-md">
            <div className="flex h-full w-full flex-col">
              <div className="flex items-center border-b bg-white p-6">
                <Image
                  className="mr-4 rounded-xl"
                  src={user?.profile?.image || defaultAvatar}
                  width={60}
                  height={60}
                  alt={"User avatar"}
                />
                <div className="flex flex-col space-y-1">
                  <span className="bold text-xl text-slate-800">
                    {getFullNameOrNull(user?.profile || null) || "unknown"}
                  </span>
                  <span className="text-sm text-slate-600">
                    {user?.email || "john@doe.com"}
                  </span>
                </div>
              </div>
              <div className="flex h-full w-full flex-col items-center justify-center space-y-2 p-6">
                <Link
                  to="settings/account"
                  className="flex w-full items-center space-x-2 rounded-md py-4 px-5 text-slate-500 hover:bg-slate-100"
                >
                  <PencilAltIcon className="h-5 w-5" />
                  <span>Account settings</span>
                </Link>
                <Form method="post" action="/logout" className="w-full">
                  <button
                    type="submit"
                    className="flex w-full items-center space-x-2 rounded-md py-4 px-5 text-slate-500 hover:bg-slate-100"
                  >
                    <LogoutIcon className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </Form>
              </div>
            </div>
          </Popover.Panel>
        </Popover>
      </div>
    </div>
  );
};
