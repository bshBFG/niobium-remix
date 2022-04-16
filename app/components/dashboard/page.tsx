import { ReplyIcon } from "@heroicons/react/outline";
import { ReactNode } from "react";
import { Link } from "remix";

type PageProps = {
  children: ReactNode;
  title: string;
  back?: boolean;
};

export const Page = ({ children, title, back }: PageProps) => {
  return (
    <div className="flex w-full flex-col space-y-6">
      <div className="flex justify-between">
        <h1 className="text-3xl text-slate-800">{title}</h1>
        {back && (
          <div>
            <Link
              to=".."
              className=" flex items-center space-x-2 rounded-lg border-2 border-blue-400 px-4 py-2 text-blue-400 hover:bg-blue-400 hover:text-white"
            >
              <span>Back</span>
              <ReplyIcon className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
      <div className="flex-auto">{children}</div>
    </div>
  );
};
