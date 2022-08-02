import type { ActionFunction } from "@remix-run/node";

import { Page } from "~/components/dashboard/page";
import { useUser } from "~/utils/utils";
import {
  updatePasswordOnlyForm,
  updateProfileOnlyForm,
} from "~/utils/users.server";
import { PasswordForm, ProfileForm } from "~/components/dashboard/user-forms";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const _action = formData.get("_action");

  if (_action === "updatePassword") {
    return updatePasswordOnlyForm(formData, true);
  }

  if (_action === "updateProfile") {
    return updateProfileOnlyForm(formData);
  }
};

export default function SettingsAccountPage() {
  const user = useUser();

  return (
    <Page title="User editing">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-auto flex-col gap-6">
          <ProfileForm user={user} />
        </div>
        <div className="flex flex-auto flex-col gap-6">
          <PasswordForm user={user} oldPassword={true} />
        </div>
      </div>
    </Page>
  );
}
