import type { LoaderFunction } from "@remix-run/node";

import {
  badImageResponse,
  formatImageWithCache,
  formatImageWithoutCache,
} from "~/modules/image";

const LOCAL_CACHE_IMAGES = false;

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const { formattedImage, status } = LOCAL_CACHE_IMAGES
      ? await formatImageWithCache(request)
      : await formatImageWithoutCache(request);

    return new Response(formattedImage as any, {
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
