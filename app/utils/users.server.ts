import { json } from "@remix-run/node";

import {
  getUserByEmail,
  Role,
  updatePasswordOnly,
  updateProfileOnly,
  updateUserOnly,
  verifyPassword,
} from "~/models/user.server";
import { validateEmail } from "./utils";

export type ActionData = {
  formError?: {
    user?: string;
    profile?: string;
    password?: string;
  };
  fieldErrors?: {
    email?: string;
    role?: string;
    oldPassword?: string;
    newPassword?: string;
    image?: string;
    firstName?: string;
    secondName?: string;
  };
  fields?: {
    email?: string;
    role?: string;
    oldPassword?: string;
    newPassword?: string;
    image?: string;
    firstName?: string;
    secondName?: string;
  };
};

export const badRequest = (data: ActionData) => json(data, { status: 400 });

export const updateUserOnlyForm = async (formData: FormData) => {
  const userId = formData.get("userId");
  const email = formData.get("email");
  const role = formData.get("role");

  if (
    typeof userId !== "string" ||
    typeof email !== "string" ||
    typeof role !== "string"
  ) {
    return badRequest({
      formError: {
        user: `Form not submitted correctly.`,
      },
    });
  }

  const fields = { email, role };
  const fieldErrors = {
    email: validateEmail(email) ? undefined : "Email is invalid",
    role: role in Role ? undefined : "Role is invalid",
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fields, fieldErrors });
  }

  const userExists = await getUserByEmail(email);
  if (userExists && userExists.id !== userId) {
    return badRequest({
      fields,
      fieldErrors: {
        email: "This email is already in use",
      },
    });
  }

  const user = await updateUserOnly(userId, email, role as Role);

  return json({
    fields: {
      email: user.email,
      role: user.role,
    },
  });
};

export const updatePasswordOnlyForm = async (
  formData: FormData,
  oldPassword: boolean = false
) => {
  const userId = formData.get("userId");
  const newPassword = formData.get("newPassword");

  if (oldPassword) {
    const oldPassword = formData.get("oldPassword");

    if (
      typeof userId !== "string" ||
      typeof oldPassword !== "string" ||
      typeof newPassword !== "string"
    ) {
      return badRequest({
        formError: {
          password: `Form not submitted correctly.`,
        },
      });
    }

    const fields = { oldPassword };
    const fieldErrors = {
      oldPassword: (await verifyPassword(userId, oldPassword))
        ? undefined
        : "Invalid password",
      newPassword: newPassword.length > 3 ? undefined : "Password is too short",
    };
    if (Object.values(fieldErrors).some(Boolean)) {
      return badRequest({ fields, fieldErrors });
    }

    await updatePasswordOnly(userId, newPassword);

    return json({
      fields: {
        oldPassword,
        newPassword,
      },
    });
  }

  if (typeof userId !== "string" || typeof newPassword !== "string") {
    return badRequest({
      formError: {
        password: `Form not submitted correctly.`,
      },
    });
  }

  const fields = { newPassword };
  const fieldErrors = {
    newPassword: newPassword.length > 3 ? undefined : "Password is too short",
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fields, fieldErrors });
  }

  await updatePasswordOnly(userId, newPassword);

  return json({
    fields: {
      newPassword,
    },
  });
};

export const updateProfileOnlyForm = async (formData: FormData) => {
  const userId = formData.get("userId");
  const image = formData.get("image");
  const firstName = formData.get("firstName");
  const secondName = formData.get("secondName");

  if (
    typeof userId !== "string" ||
    typeof image !== "string" ||
    typeof firstName !== "string" ||
    typeof secondName !== "string"
  ) {
    return badRequest({
      formError: {
        profile: `Form not submitted correctly.`,
      },
    });
  }

  // const imageOrNull = image.length !== 0 ? image : null;
  // const firstNameOrNull = firstName.length !== 0 ? firstName : null;
  // const secondNameOrNull = secondName.length !== 0 ? secondName : null;

  const profile = await updateProfileOnly(userId, image, firstName, secondName);

  return json({
    fields: {
      image: profile.image,
      firstName: profile.firstName,
      secondName: profile.secondName,
    },
  });
};
