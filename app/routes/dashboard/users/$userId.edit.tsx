import type { ActionFunction, LoaderFunction } from "remix";
import { json, redirect, useLoaderData } from "remix";

import { Profile, User } from "~/models/user.server";
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
} from "~/components/dashboard/user-froms";

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
  const { user } = useLoaderData<LoaderData>();

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
