import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import type { Profile, User } from "~/models/user.server";
import { getUserWithProfileById } from "~/models/user.server";
import { getFullNameOrNull, toCapitalize } from "~/utils/utils";
import { Image } from "~/modules/image";
import defaultAvatar from "~/components/dashboard/images/default-avatar.jpg";
import { Page } from "~/components/dashboard/page";

type LoaderData = {
  user: User & { profile: Profile | null };
};

export const loader: LoaderFunction = async ({ params }) => {
  const { userId } = params;
  if (typeof userId !== "string") {
    return redirect("/dashboard/users");
  }

  const user = await getUserWithProfileById(userId);
  if (user === null) {
    return redirect("/dashboard/users");
  }

  return json<LoaderData>({
    user,
  });
};

export default function UserInfoPage() {
  const { user } = useLoaderData<LoaderData>();

  return (
    <Page title="User info" back>
      <div className="grid w-full max-w-2xl gap-6">
        <div className="h-max w-full overflow-hidden rounded-2xl bg-white px-6 py-6 shadow-xl">
          <div className="flex flex-col items-center justify-center">
            <div>
              <Image
                className="overflow-hidden rounded-xl"
                src={user.profile?.image || defaultAvatar}
                width={150}
                height={150}
              />
            </div>
            <div>
              <span className="text-2xl font-semibold text-slate-800">
                {getFullNameOrNull(user.profile) || "unknown"}
              </span>
            </div>
            <div>
              <span className="text-slate-600">{user.email}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-600">
                {toCapitalize(user.role)}
              </span>
            </div>
            <div className="mt-4 flex space-x-2">
              <Link
                to="edit"
                className="rounded-lg bg-blue-400 px-4 py-2 text-white"
              >
                Edit
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
