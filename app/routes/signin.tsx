import { Form, Link } from "remix";

export default function LoginPage() {
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
          <h1 className="text-2xl">Sign in</h1>
        </div>

        <Form method="post" className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div>
              <input
                type="email"
                autoComplete="email"
                className="w-full rounded border border-gray-400 px-2 py-1 text-lg"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div>
              <input
                type="password"
                autoComplete="password"
                className="w-full rounded border border-gray-400 px-2 py-1 text-lg"
              />
            </div>
          </div>

          <input type="hidden" name="redirectTo" value="" />

          <button
            type="submit"
            className="w-full rounded bg-black  py-2 px-4 text-white hover:bg-gray-900 focus:bg-gray-800"
          >
            Log in
          </button>

          <div className="flex items-center justify-center">
            <div className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link className="text-blue-500 underline" to="/signup">
                Sign up
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
