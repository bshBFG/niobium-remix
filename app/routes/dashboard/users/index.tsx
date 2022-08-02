import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "~/components/dashboard/table";
import { Image } from "~/modules/image";
import { getFullNameOrNull, toCapitalize } from "~/utils/utils";
import defaultAvatar from "~/components/dashboard/images/default-avatar.jpg";
import { deleteUserById, getAllUsersWithProfile } from "~/models/user.server";
import type { Profile, User } from "~/models/user.server";
import { Page } from "~/components/dashboard/page";

type LoaderData = {
  users: Array<User & { profile: Profile | null }>;
};

export const loader: LoaderFunction = async () => {
  const data: LoaderData = {
    users: await getAllUsersWithProfile(),
  };

  return data;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const userId = formData.get("userId");

  if (typeof userId !== "string") {
    return json({
      status: 403,
    });
  }

  const deletedUser = await deleteUserById(userId);
  return json({ deletedUser });
};

export default function DashboardUsersPage() {
  const { users } = useLoaderData<LoaderData>();

  return (
    <Page title="Users">
      <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex justify-between px-6 py-6">
          <div className="space-x-2">
            <span className="font-bold">All users</span>
            <span className="font-bold text-slate-400">{users.length}</span>
          </div>
          <Link
            to="create"
            className="rounded-lg bg-blue-400 px-4 py-2 text-white"
          >
            <span>Add user</span>
          </Link>
        </div>
        <div className="w-full overflow-hidden overflow-x-auto">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <input type="checkbox" name="" id="" />
                </TableCell>
                <TableCell>Order</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>
                  <span className="sr-only">Edit</span>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.email}>
                  <TableCell>
                    <input type="checkbox" />
                  </TableCell>
                  <TableCell>
                    <Link to={`${user.id}`} className="flex items-center">
                      <div className="relative h-11 w-11 overflow-hidden rounded-xl">
                        <Image
                          src={user.profile?.image || defaultAvatar}
                          width={44}
                          height={44}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="font-semibold text-slate-700">
                          {getFullNameOrNull(user.profile) || "unknown"}
                        </div>
                        <div className="text-md text-slate-600">
                          {user.email}
                        </div>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex rounded-full bg-green-100 px-3 text-xs font-semibold leading-7 text-green-800">
                      {"Active"}
                    </span>
                  </TableCell>
                  <TableCell>{toCapitalize(user.role)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Form method="post">
                        <input type="hidden" name="userId" value={user.id} />
                        <button
                          type="submit"
                          className="mr-4 hover:text-red-400"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </Form>
                      <Link
                        to={`${user.id}/edit`}
                        className="hover:text-indigo-400"
                      >
                        <PencilAltIcon className="h-5 w-5" />
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Page>
  );
}
