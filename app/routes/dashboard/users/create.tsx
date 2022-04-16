import { useEffect, useRef } from "react";
import type { ActionFunction } from "remix";
import { Form, json, useActionData, useTransition } from "remix";

import type { ImageInputHandle } from "~/components/dashboard/input";
import { ImageInput, Input } from "~/components/dashboard/input";
import { Page } from "~/components/dashboard/page";
import { createUser, getUserByEmail, Role } from "~/models/user.server";
import { validateEmail } from "~/utils/utils";

type ActionData = {
  formError?: string;
  fieldErrors?: {
    email?: string;
    role?: string;
    password?: string;
    image?: string;
    firstName?: string;
    secondName?: string;
  };
  fields?: {
    email?: string;
    role?: string;
    password?: string;
    image?: string;
    firstName?: string;
    secondName?: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const role = formData.get("role");
  const image = formData.get("image");
  const firstName = formData.get("firstName");
  const secondName = formData.get("secondName");

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof role !== "string" ||
    typeof image !== "string" ||
    typeof firstName !== "string" ||
    typeof secondName !== "string"
  ) {
    return badRequest({
      formError: "Form not submitted correctly.",
    });
  }

  const fields = { email, password, role, image, firstName, secondName };
  const fieldErrors = {
    email: validateEmail(email) ? undefined : "Email is invalid",
    password: password.length > 3 ? undefined : "Password is too short",
    role: role in Role ? undefined : "Role is invalid",
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fields, fieldErrors });
  }

  const userExists = await getUserByEmail(email);
  if (userExists) {
    return badRequest({
      fields,
      fieldErrors: {
        email: "This email is already in use",
      },
    });
  }

  await createUser(email, password, role as Role, image, firstName, secondName);

  return json({
    fields: {
      image: image,
      firstName: firstName,
      secondName: secondName,
    },
  });
};

export default function DashboardUsersCreatePage() {
  const actionData = useActionData<ActionData>();

  const transition = useTransition();
  const isSubmitting = transition.state === "submitting";

  const formRef = useRef<HTMLFormElement | null>(null);
  const avatarRef = useRef<ImageInputHandle | null>(null);

  useEffect(() => {
    if (
      formRef !== null &&
      !Object.values(actionData?.fieldErrors || []).some(Boolean)
    ) {
      formRef.current?.reset();
      avatarRef.current?.resetImage();
    }
  }, [actionData]);

  return (
    <Page title="Create user" back>
      <div className="grid w-full max-w-2xl gap-6">
        <div className="flex flex-auto flex-col gap-6">
          <div className="h-max w-full overflow-hidden rounded-2xl bg-white px-6 py-6 shadow-xl md:row-span-2">
            <Form ref={formRef} method="post" className="flex h-full flex-col">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold text-slate-800">
                  New user
                </h2>
                {actionData?.formError && (
                  <div className="text-sm text-red-500">
                    <span>{actionData.formError}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  label="Email"
                  name="email"
                  error={actionData?.fieldErrors?.email}
                  className="col-span-2 flex flex-col md:col-span-1"
                />
                <Input
                  label="New password"
                  name="password"
                  error={actionData?.fieldErrors?.password}
                  type="password"
                  className="col-span-2 flex flex-col md:col-span-1"
                />

                <div className="flex flex-col">
                  <label
                    htmlFor="role"
                    className="mb-2 text-sm font-bold text-slate-600"
                  >
                    Role
                  </label>
                  <select
                    name="role"
                    id="role"
                    className="max-w-max rounded-md border border-slate-300 bg-white px-4 py-2"
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  {actionData?.fieldErrors?.role && (
                    <div>
                      <span className="text-sm text-red-500">
                        {actionData.fieldErrors.role}
                      </span>
                    </div>
                  )}
                </div>

                <ImageInput ref={avatarRef} />

                <Input
                  label="First name"
                  name="firstName"
                  className="col-span-2 md:col-span-1"
                />

                <Input
                  label="Second name"
                  name="secondName"
                  className="col-span-2 md:col-span-1"
                />
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className={`rounded-lg bg-blue-400 px-4 py-2 text-white disabled:opacity-50`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create"}
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </Page>
  );
}
