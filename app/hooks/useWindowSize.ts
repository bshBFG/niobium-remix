import { useEffect, useMemo, useState } from "react";

type Size = {
  width?: number;
  height?: number;
};

export enum Breakpoints {
  "sm" = 640,
  "md" = 768,
  "lg" = 1024,
  "xl" = 1280,
  "2xl" = 1536,
}

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<Size>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    if (!windowSize.width && !windowSize.height && window) {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
  }, [windowSize]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const calcInnerWidth = () => {
      clearTimeout(timeout);
      timeout = setTimeout(
        () =>
          setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
          }),
        200
      );
    };

    window.addEventListener("resize", calcInnerWidth);

    return () => window.removeEventListener("resize", calcInnerWidth);
  }, []);

  const memoed = useMemo(() => {
    const minWidth = (breakpoint: Breakpoints): boolean => {
      if (typeof windowSize.width !== "number") {
        return false;
      }

      if (windowSize.width > breakpoint) {
        return true;
      }

      return false;
    };
    return {
      windowSize,
      minWidth,
    };
  }, [windowSize]);

  return memoed;
};
