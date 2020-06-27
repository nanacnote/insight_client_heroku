import { useEffect, useState } from "react";
import debounce from "lodash/debounce";
import { minBy } from "lodash/math";

var helper = function (
  arg: Array<string>
): {
  id: string;
  element: HTMLElement;
  sum: number;
} {
  const rollcall = arg.map((e) => {
    let element = document.getElementById(e);
    if (element) {
      let sum =
        element.getBoundingClientRect().top +
        element.getBoundingClientRect().bottom;
      return sum < 0
        ? { id: e, element: element, sum: Math.abs(sum) }
        : { id: e, element: element, sum: 0 };
    }
    return {id: null, element: null, sum: null}
  });
  return minBy(rollcall, function (o: any) {
    return o?.sum;
  });
};

// Hook to determine what referenced object is in view
export function useInView(arg: Array<string>) {
  const [idInView, setidInView] = useState<string>();
  const [elementInView, setelementInView] = useState<HTMLElement>();

  useEffect(() => {
    const scrollHandler = () => {
      setidInView(helper(arg)?.id);
      setelementInView(helper(arg)?.element);
    };

    window.addEventListener("scroll", debounce(scrollHandler, 1000));

    return () => {
      window.removeEventListener("scroll", debounce(scrollHandler, 1000));
    };
  }, [arg]);

  return [idInView, elementInView];
}
