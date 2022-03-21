import { Form, Link } from "remix";

import { useOptionalUser } from "~/utils/utils";
import background from "../../public/dance.png";

export default function Index() {
  const user = useOptionalUser();

  return (
    <div className="relative flex h-screen w-screen flex-col text-gray-800">
      <div className="absolute top-0 left-0 -z-50 grid h-screen w-screen place-content-center overflow-hidden bg-slate-50">
        <img
          src={background}
          alt="dance"
          className="h-screen translate-y-20 object-cover"
        />
      </div>

      <div className="flex h-20 w-screen items-center justify-between px-8">
        <div className="relative">
          <span className="text-4xl font-bold text-black">Niobium</span>
          <span className="absolute right-0 translate-x-12 rotate-45 rounded-md bg-black px-1.5 py-0.5 font-bold">
            <span className="text-blue-200">R</span>
            <span className="text-green-200">e</span>
            <span className="text-orange-200">m</span>
            <span className="text-purple-200">i</span>
            <span className="text-red-200">x</span>
          </span>
        </div>

        <div className="flex-1"></div>

        <div className="mr-10">
          <div className="space-x-4 text-gray-700">
            <Link
              className="hover:text-black hover:underline hover:decoration-black"
              to="/"
            >
              Home
            </Link>
            <Link
              className="hover:text-black hover:underline hover:decoration-black"
              to="/dashboard"
            >
              Dashboard
            </Link>
          </div>
        </div>

        {user ? (
          <div className="flex items-center justify-center space-x-8">
            <Link
              to="/dashboard"
              className="flex flex-col items-center justify-center"
            >
              <div className="font-bold text-black">John Doe</div>
              <div className="text-xs">{user.email}</div>
            </Link>

            <Form action="/logout" method="post">
              <button
                type="submit"
                className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-900"
              >
                Log Out
              </button>
            </Form>
          </div>
        ) : (
          <div className="space-x-2">
            <Link
              to="/signup"
              className="rounded-md border-2 border-black px-3 py-1.5 text-black hover:border-gray-900 hover:bg-gray-900 hover:text-white"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-900"
            >
              Log In
            </Link>
          </div>
        )}
      </div>

      <div className="relative grid flex-1 place-content-center">
        <div className="relative mb-20 grid h-28 place-content-center bg-black px-10">
          <div className="absolute top-2/4 left-2/4 -z-10 flex h-32 w-[105%] -translate-y-2/4 -translate-x-2/4">
            <div className="h-full w-1/5 bg-blue-400 blur-md" />
            <div className="h-full w-1/5 bg-green-400 blur-md" />
            <div className="h-full w-1/5 bg-orange-400 blur-md" />
            <div className="h-full w-1/5 bg-purple-400 blur-md" />
            <div className="h-full w-1/5 bg-red-400 blur-md" />
          </div>
          <h1 className="relative text-6xl font-bold text-white">
            Niobium Template
          </h1>
        </div>
      </div>
    </div>
  );
}
