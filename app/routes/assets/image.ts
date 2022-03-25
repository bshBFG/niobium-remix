import { LoaderFunction } from "remix";
import {} from "@remix-run/express";

import {
  badImageResponse,
  formatImageWithCache,
  formatImageWithoutCache,
} from "~/utils/image.server";

const LOCAL_CACHE_IMAGES = false;

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const { formatedImage, status } = LOCAL_CACHE_IMAGES
      ? await formatImageWithCache(request)
      : await formatImageWithoutCache(request);

    return new Response(formatedImage as any, {
      status: status || 200,
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (e) {
    return badImageResponse();
  }
};
