import type { ComponentPropsWithoutRef } from "react";
import type { FitEnum } from "sharp";

const DEFAULT_RESIZE_URL = "/assets/image";

export type ResponsiveImage = {
  maxWidth?: number;
  size: {
    width: number;
    height?: number;
  };
};

export type ImageProps = ComponentPropsWithoutRef<"img"> & {
  optimizerUrl?: string;
  quality?: number | string;
  fit?: keyof FitEnum;
  position?: number | string;
  responsive?: ResponsiveImage[];
};

export const Image = ({
  optimizerUrl = DEFAULT_RESIZE_URL,
  width,
  height,
  responsive,
  quality,
  fit,
  src,
  alt,
  ...rest
}: ImageProps) => {
  const url = src ? optimizerUrl + "?src=" + encodeURIComponent(src) : src;

  const query = new URLSearchParams();

  if (width) {
    query.set("width", width.toString());
  }

  if (height) {
    query.set("height", height.toString());
  }

  if (fit) {
    query.set("fit", fit);
  }

  if (rest.position) {
    query.set("position", rest.position.toString());
  }

  if (quality) {
    query.set("quality", quality.toString());
  }

  const props: ComponentPropsWithoutRef<"img"> = {
    src: url + `&${query}`,
  };

  const sizes: { height?: string | number; width?: string | number } = {};
  let largestImageWidth = 0;
  let largestImageSrc: string | undefined;
  if (responsive && responsive.length) {
    const srcSet = [];
    const sizes = [];

    for (let { maxWidth, size } of responsive) {
      const query = new URLSearchParams();

      query.set("width", size.width.toString());

      if (size.height) {
        query.set("height", size.height.toString());
      }

      if (fit) {
        query.set("fit", fit);
      }

      if (rest.position) {
        query.set("position", rest.position.toString());
      }

      if (quality) {
        query.set("quality", quality.toString());
      }

      const srcSetUrl = url + `&${query} ${size.width}w`;
      srcSet.push(srcSetUrl);

      if (maxWidth) {
        sizes.push(`(max-width: ${maxWidth}px) ${size.width}px`);
      }

      if (size.width > largestImageWidth) {
        largestImageWidth = size.width;
        largestImageSrc = srcSetUrl;
      }
    }
    props.srcSet = srcSet.join(", ");
    props.sizes = sizes.join(", ") || "100vw";
    props.src = "";
  } else {
    sizes.height = height;
    sizes.width = width;
  }

  if (largestImageSrc && (!width || largestImageWidth > width)) {
    props.src = largestImageSrc;
  }

  return <img {...rest} {...props} {...sizes} alt={alt} />;
};
