import { useState, useEffect } from "react";

const debounce = require("lodash/debounce");

// helper function to translate the size to string of xs sm md lg
const helper = (arg: number) => {
  if (arg < 320) {
    return "xs";
  } else if (arg >= 320 && arg < 720) {
    return "sm";
  } else if (arg >= 720 && arg < 1024) {
    return "md";
  } else if (arg >= 1024) {
    return "lg";
  }
};

// Hook to monitor viewport size
export function useBreakPoint() {
  const [BreakPoint, setBreakPoint] = useState<
    "xs" | "sm" | "md" | "lg" | undefined
  >(helper(window?.innerWidth));

  useEffect(() => {
    if (typeof window !== "object") {
      return;
    }

    const handleResize = () => {
      setBreakPoint(helper(window.innerWidth));
    };

    window.addEventListener("resize", debounce(handleResize, 500));

    return () => {
      window.removeEventListener("resize", debounce(handleResize, 500));
    };
  }, []);

  return BreakPoint;
}
