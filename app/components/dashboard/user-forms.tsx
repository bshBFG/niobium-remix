import { useEffect, useRef } from "react";
import { useFetcher } from "@remix-run/react";

import type { UserWithProfile } from "~/models/user.server";
import type { ActionData } from "~/utils/users.server";
import { ImageInput, Input } from "./input";

type FormsProps = {
  user: UserWithProfile;
};

export const UserForm = ({ user }: FormsProps) => {
  const fetcher = useFetcher<ActionData>();
  const isSubmitting =
    fetcher.submission &&
    fetcher.submission.formData.get("_action") === "updateUser";

  return (
    <div className="h-max w-full overflow-hidden rounded-2xl bg-white px-6 py-6 shadow-xl md:row-span-2">
      <fetcher.Form method="post" className="flex h-full flex-col">
        <input type="hidden" name="userId" value={user.id} />
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-slate-800">Account</h2>
          {fetcher.data?.formError?.user && (
            <div className="text-sm text-red-500">
              <span>{fetcher.data.formError.user}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Email"
            name="email"
            defaultValue={user.email}
            error={fetcher.data?.fieldErrors?.email}
          />
          <div className="flex flex-col">
            <label
              htmlFor="role"
              className="mb-2 text-sm font-bold text-slate-600"
            >
              Role
            </label>
            <select
              defaultValue={user.role}
              name="role"
              id="role"
              className="max-w-max rounded-md border border-slate-300 bg-white px-4 py-2"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
            {fetcher.data?.fieldErrors?.role && (
              <div>
                <span className="text-sm text-red-500">
                  {fetcher.data.fieldErrors.role}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            name="_action"
            value="updateUser"
            className={`rounded-xl bg-blue-400 px-4 py-2 text-white${
              fetcher.state === "submitting" ? " opacity-50" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </fetcher.Form>
    </div>
  );
};

export const ProfileForm = ({ user }: FormsProps) => {
  const fetcher = useFetcher<ActionData>();
  const isSubmitting =
    fetcher.submission &&
    fetcher.submission.formData.get("_action") === "updateProfile";

  return (
    <div className="h-max w-full overflow-hidden rounded-2xl bg-white px-6 py-6 shadow-xl md:row-span-3">
      <fetcher.Form method="post" className="flex h-full flex-col">
        <input type="hidden" name="userId" value={user.id} />
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-slate-800">Profile</h2>
          {fetcher.data?.formError?.profile && (
            <div className="text-sm text-red-500">
              <span>{fetcher.data.formError.profile}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ImageInput image={user.profile?.image || ""} />

          <Input
            label="First name"
            name="firstName"
            defaultValue={user.profile?.firstName || ""}
            className="col-span-2 md:col-span-1"
          />

          <Input
            label="Second name"
            name="secondName"
            defaultValue={user.profile?.secondName || ""}
            className="col-span-2 md:col-span-1"
          />
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            name="_action"
            value="updateProfile"
            className={`rounded-lg bg-blue-400 px-4 py-2 text-white disabled:opacity-50`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </fetcher.Form>
    </div>
  );
};

type PasswordFormProps = FormsProps & {
  oldPassword?: boolean;
};

export const PasswordForm = ({
  user,
  oldPassword = false,
}: PasswordFormProps) => {
  const fetcher = useFetcher<ActionData>();
  const isSubmitting =
    fetcher.submission &&
    fetcher.submission.formData.get("_action") === "updatePassword";

  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (
      formRef !== null &&
      !Object.values(fetcher.data?.fieldErrors || []).some(Boolean)
    ) {
      formRef.current?.reset();
    }
  }, [fetcher.data]);

  return (
    <div className="h-max w-full overflow-hidden rounded-2xl bg-white px-6 py-6 shadow-xl md:row-span-2">
      <fetcher.Form
        ref={formRef}
        method="post"
        className="flex h-full flex-col"
      >
        <input type="hidden" name="userId" value={user.id} />
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-slate-800">Password</h2>
          {fetcher.data?.formError?.password && (
            <div className="text-sm text-red-500">
              <span>{fetcher.data.formError.password}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {oldPassword && (
            <Input
              label="Old password"
              name="oldPassword"
              error={fetcher.data?.fieldErrors?.oldPassword}
              type="password"
            />
          )}

          <Input
            label="New password"
            name="newPassword"
            error={fetcher.data?.fieldErrors?.newPassword}
            type="password"
          />
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            name="_action"
            value="updatePassword"
            className={`rounded-lg bg-blue-400 px-4 py-2 text-white disabled:opacity-50`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </fetcher.Form>
    </div>
  );
};
