import { forwardRef, useImperativeHandle, useState } from "react";

import { Image } from "~/modules/image";
import defaultAvatar from "~/components/dashboard/images/default-avatar.jpg";

type InputProps = React.ComponentProps<"input"> & {
  label: string;
  name: string;
  error?: string;
};

export const Input = (props: InputProps) => {
  const { label, name, className, error, ...rest } = props;

  return (
    <div className={`flex flex-col${className ? " " + className : ""}`}>
      <label htmlFor={name} className="mb-2 text-sm font-bold text-slate-600">
        {label}
      </label>
      <input
        id={name}
        name={name}
        className={`rounded-md border ${
          error ? "border-red-400" : "border-slate-300"
        } px-4 py-2`}
        {...rest}
      />

      {error && (
        <div>
          <span className="text-sm text-red-500">{error}</span>
        </div>
      )}
    </div>
  );
};

export type ImageInputHandle = {
  resetImage: () => void;
};

type ImageInputProps = React.ComponentProps<"input"> & {
  error?: string;
  image?: string;
};

export const ImageInput = forwardRef<ImageInputHandle, ImageInputProps>(
  (props: ImageInputProps, ref) => {
    const { image } = props;
    const [avatar, setAvatar] = useState<string>(image || "");

    const resetImage = () => {
      setAvatar("");
    };

    useImperativeHandle(ref, () => ({
      resetImage: resetImage,
    }));

    return (
      <div className="col-span-2 flex flex-col">
        <div className="mb-2 text-sm font-semibold text-slate-600">Avatar</div>

        <div className="flex items-center">
          <div className="relative mr-4 h-24 w-24">
            <Image
              className="overflow-hidden rounded-xl"
              src={avatar || defaultAvatar}
              width={96}
              height={96}
            />
          </div>
          <div className="flex flex-col justify-center">
            <input
              type="text"
              name="image"
              value={avatar}
              onChange={(e) => {
                setAvatar(e.target.value);
              }}
              className="mb-2 text-slate-500"
            />
            <div className="flex space-x-2">
              <button
                type="button"
                className="rounded-lg border border-blue-400 px-2 py-1 text-blue-400 hover:bg-blue-400 hover:text-white"
              >
                Upload
              </button>
              <button
                type="button"
                onClick={() => setAvatar("")}
                className="rounded-lg border border-slate-300 px-2 py-1 text-slate-400 hover:bg-slate-300 hover:text-white"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ImageInput.displayName = "SearchInput";
