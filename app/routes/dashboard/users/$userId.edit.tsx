import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import type { UserWithProfile } from "~/models/user.server";
import { getUserWithProfileById } from "~/models/user.server";
import { Page } from "~/components/dashboard/page";
import {
  updatePasswordOnlyForm,
  updateProfileOnlyForm,
  updateUserOnlyForm,
} from "~/utils/users.server";
import {
  PasswordForm,
  ProfileForm,
  UserForm,
} from "~/components/dashboard/user-forms";

type LoaderData = {
  user: UserWithProfile;
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

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const _action = formData.get("_action");

  if (_action === "updateUser") {
    return updateUserOnlyForm(formData);
  }

  if (_action === "updatePassword") {
    return updatePasswordOnlyForm(formData);
  }

  if (_action === "updateProfile") {
    return updateProfileOnlyForm(formData);
  }
};

export default function UserEditPage() {
  const data = useLoaderData<LoaderData>();
  const user = data.user as any as UserWithProfile;

  return (
    <Page title="User editing" back>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-auto flex-col gap-6">
          <UserForm user={user} />
          <ProfileForm user={user} />
        </div>
        <div className="flex flex-auto flex-col gap-6">
          <PasswordForm user={user} />
        </div>
      </div>
    </Page>
  );
}
