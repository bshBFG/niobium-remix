import crypto from "crypto";
import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import type { Readable } from "stream";
import { PassThrough } from "stream";
import { fetch as nodeFetch, Request as NodeRequest } from "@remix-run/node";
import type { FitEnum } from "sharp";
import sharp from "sharp";

const ASSETS_FOLDER = "public";
const CACHE_FOLDER = ".cache/images";

const badImageBase64 =
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export function badImageResponse() {
  let buffer = Buffer.from(badImageBase64, "base64");
  return new Response(buffer, {
    status: 500,
    headers: {
      "Cache-Control": "max-age=0",
      "Content-Type": "image/gif;base64",
      "Content-Length": buffer.length.toFixed(0),
    },
  });
}

type ResizeParams = {
  width: number | null;
  height: number | null;
  fit: string | null;
  position: string | null;
};

type FormatParams = {
  quality: number | null;
};

type ExtractedParams = ResizeParams &
  FormatParams & {
    url: URL;
    src: string | null;
  };

export function extractImageParams(request: Request): ExtractedParams {
  const url = new URL(request.url);

  const src = url.searchParams.get("src");

  const width = getIntOrNull(url.searchParams.get("width"));
  const height = getIntOrNull(url.searchParams.get("height"));
  const quality = getIntOrNull(url.searchParams.get("quality"));
  const fit = url.searchParams.get("fit");
  const position = url.searchParams.get("position");

  return {
    url,
    src,
    width,
    height,
    quality,
    fit,
    position,
  };
}

function getIntOrNull(value: string | null) {
  if (value === null) {
    return null;
  }

  return Number.parseInt(value);
}

async function checkFileExists(path: string) {
  const exists = await fsp
    .stat(path)
    .then((s) => s.isFile())
    .catch(() => false);

  return exists;
}

export async function createImageReadStreamFromSrc(src: string) {
  const imagePath = path.join(ASSETS_FOLDER, src);

  const exists = await checkFileExists(imagePath);
  if (!exists) {
    throw new Error(`${imagePath} is not a file`);
  }

  const imageReadStream: Readable = fs.createReadStream(imagePath);

  return {
    imageReadStream,
    status: null,
  };
}

export async function createImageReadStreamFromUrl(src: string) {
  const imgRequest = new NodeRequest(src.toString());
  const imageResponse = await nodeFetch(imgRequest);

  const passThroughImage = new PassThrough();

  const imageBody = imageResponse.body;
  const status = imageResponse.status;

  const imageReadStream: Readable = imageBody.pipe(passThroughImage);

  return {
    imageReadStream,
    status,
  };
}

type CalculatedResizeOptions = {
  width?: number;
  height?: number;
  fit?: keyof FitEnum;
  position?: string;
};

function calcResizeOptions(options: ResizeParams): CalculatedResizeOptions {
  const calculatedOptions: CalculatedResizeOptions = {};

  if (options.width) {
    calculatedOptions.width = options.width;
  }

  if (options.height) {
    calculatedOptions.height = options.height;
  }

  if (options.fit) {
    calculatedOptions.fit = options.fit as keyof FitEnum;
  }

  if (options.position) {
    calculatedOptions.position = options.position;
  }

  return calculatedOptions;
}

type CalculatedFormatOptions = {
  quality?: number;
};

function calcFormatOptions(options: FormatParams): CalculatedFormatOptions {
  const exp: CalculatedFormatOptions = {};

  if (options.quality) exp.quality = options.quality;

  return exp;
}

function createTransformImageStream({
  width,
  height,
  fit,
  position,
  quality,
}: ResizeParams & FormatParams) {
  const sharpInstance = sharp();
  sharpInstance.on("error", (error) => {
    console.error(error);
  });

  const resizeOptions = calcResizeOptions({ width, height, fit, position });
  const formatOptions = calcFormatOptions({ quality });

  if (resizeOptions.width || resizeOptions.height) {
    sharpInstance.resize(resizeOptions);
  }

  sharpInstance.webp({ ...formatOptions });

  return sharpInstance;
}

function getCachedImagePath(
  request: Request,
  params: Omit<ExtractedParams, "src">
): string {
  const { width, height, quality, fit, position } = params;
  const hash = crypto.createHash("sha256");
  hash.update("v1");
  hash.update(request.method);
  hash.update(request.url);
  if (width) hash.update(width.toString());
  if (height) hash.update(height.toString());
  if (quality) hash.update(quality.toString());
  if (fit) hash.update(fit.toString());
  if (position) hash.update(position.toString());
  const key = hash.digest("hex");
  const cachedFile = path.join(CACHE_FOLDER, key + ".webp");

  return cachedFile;
}

function checkimageSource(src: string): "src" | "url" {
  if (src.startsWith("/") && (src.length === 1 || src[1] !== "/")) {
    return "src";
  } else {
    return "url";
  }
}

type FormatedImage = {
  formatedImage: Readable;
  status: number | null;
};

export async function formatImageWithCache(
  request: Request
): Promise<FormatedImage> {
  const { url, src, width, height, quality, fit, position } =
    extractImageParams(request);

  if (!src) {
    throw new Error("invalid src");
  }

  const cachedImagePath = getCachedImagePath(request, {
    url,
    width,
    height,
    fit,
    position,
    quality,
  });
  const exists = await checkFileExists(cachedImagePath);

  if (exists) {
    const formatedImage = fs.createReadStream(cachedImagePath);
    return {
      formatedImage,
      status: null,
    };
  } else {
    console.info("cache skipped for", src);
  }

  const { imageReadStream, status } =
    checkimageSource(src) === "src"
      ? await createImageReadStreamFromSrc(src)
      : await createImageReadStreamFromUrl(src);

  const transformStream = createTransformImageStream({
    width,
    height,
    fit,
    position,
    quality,
  });
  imageReadStream.pipe(transformStream);

  await fsp
    .mkdir(path.dirname(cachedImagePath), { recursive: true })
    .catch(() => {});

  const cacheFileStream = fs.createWriteStream(cachedImagePath);

  await new Promise<void>((resolve, reject) => {
    transformStream.pipe(cacheFileStream);

    transformStream.on("end", () => {
      resolve();
      imageReadStream.destroy();
    });

    transformStream.on("error", async (error) => {
      imageReadStream!.destroy();
      await fsp.rm(cachedImagePath).catch(() => {});
    });
  });

  const formatedImage = fs.createReadStream(cachedImagePath);

  return { formatedImage, status };
}

export async function formatImageWithoutCache(
  request: Request
): Promise<FormatedImage> {
  const { src, width, height, quality, fit, position } =
    extractImageParams(request);

  if (!src) {
    throw new Error("invalid src");
  }

  const { imageReadStream, status } =
    checkimageSource(src) === "src"
      ? await createImageReadStreamFromSrc(src)
      : await createImageReadStreamFromUrl(src);

  const transformStream = createTransformImageStream({
    width,
    height,
    fit,
    position,
    quality,
  });

  imageReadStream.pipe(transformStream);

  return { formatedImage: transformStream, status };
}
