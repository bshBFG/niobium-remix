import { useEffect, useRef } from "react";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";

import { createUserSession, getUserId } from "~/utils/session.server";
import { verifyLogin } from "~/models/user.server";
import { validateEmail } from "~/utils/utils";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

type ActionData = {
  errors?: {
    email?: string;
    password?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = formData.get("redirectTo");
  const remember = formData.get("remember");

  if (!validateEmail(email)) {
    return json<ActionData>(
      { errors: { email: "Email is invalid" } },
      { status: 400 }
    );
  }

  if (typeof password !== "string") {
    return json<ActionData>(
      { errors: { password: "Password is required" } },
      { status: 400 }
    );
  }

  if (password.length < 4) {
    return json<ActionData>(
      { errors: { password: "Password is too short" } },
      { status: 400 }
    );
  }

  const user = await verifyLogin(email, password);

  if (!user) {
    return json<ActionData>(
      { errors: { email: "Invalid email or password" } },
      { status: 400 }
    );
  }

  return createUserSession({
    request,
    userId: user.id,
    remember: remember === "on" ? true : false,
    redirectTo: typeof redirectTo === "string" ? redirectTo : "/",
  });
};

export const meta: MetaFunction = () => {
  return {
    title: "Sign in",
  };
};

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";
  const actionData = useActionData<ActionData>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="grid h-screen w-screen place-content-center bg-slate-50">
      <div className="mb-4 flex justify-center">
        <Link to="/">
          <div className="relative w-fit">
            <span className="text-4xl font-bold text-black">Niobium</span>
            <span className="absolute right-0 translate-x-12 rotate-45 rounded-md bg-black px-1.5 py-0.5 font-bold">
              <span className="text-blue-200">R</span>
              <span className="text-green-200">e</span>
              <span className="text-orange-200">m</span>
              <span className="text-purple-200">i</span>
              <span className="text-red-200">x</span>
            </span>
          </div>
        </Link>
      </div>

      <div className="min-h-80 flex w-auto flex-col space-y-6 rounded-md border p-8 shadow-lg">
        <div className="flex w-full items-center justify-center">
          <h1 className="text-2xl">Login</h1>
        </div>

        <Form method="post" noValidate className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div>
              <input
                ref={emailRef}
                id="email"
                required
                autoFocus={true}
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={actionData?.errors?.email ? true : undefined}
                aria-describedby="email-error"
                className="w-full rounded border border-gray-400 px-2 py-1 text-lg"
              />
              {actionData?.errors?.email && (
                <div className="pt-1 text-red-700" id="email-error">
                  {actionData.errors.email}
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div>
              <input
                ref={passwordRef}
                id="password"
                required
                name="password"
                type="password"
                autoComplete="password"
                aria-invalid={actionData?.errors?.password ? true : undefined}
                aria-describedby="password-error"
                className="w-full rounded border border-gray-400 px-2 py-1 text-lg"
              />
              {actionData?.errors?.password && (
                <div className="pt-1 text-red-700" id="password-error">
                  {actionData.errors.password}
                </div>
              )}
            </div>
          </div>

          <input type="hidden" name="redirectTo" value={redirectTo} />

          <button
            type="submit"
            className="w-full rounded bg-black  py-2 px-4 text-white hover:bg-gray-900 focus:bg-gray-800"
          >
            Log In
          </button>

          <div className="flex items-center justify-center">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="remember"
              className="ml-2 block text-sm text-gray-900"
            >
              Remember me
            </label>
          </div>

          <div className="flex items-center justify-center">
            <div className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                className="text-blue-500 underline"
                to={{
                  pathname: "/signup",
                  search: searchParams.toString(),
                }}
              >
                Sign up
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
