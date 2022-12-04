import { onMounted, onUnmounted, reactive } from "vue";
import debounce from "lodash.debounce";

const screens = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

const sm = (val: number) => val >= screens.sm && val <= screens.md;
const md = (val: number) => val >= screens.md && val <= screens.lg;
const lg = (val: number) => val >= screens.lg && val <= screens.xl;
const xl = (val: number) => val >= screens.xl;

const getBreakpoint = (w: number): string => {
  if (sm(w)) return "sm";
  else if (md(w)) return "md";
  else if (lg(w)) return "lg";
  else if (xl(w)) return "xl";
  else return "all";
};

export default function useTailwindBreakpoint() {
  const breakpoint = reactive({
    w: window.innerWidth,
    h: window.innerHeight,
    is: getBreakpoint(window.innerWidth),
  });

  const resizeListener = debounce(() => {
    breakpoint.w = window.innerWidth;
    breakpoint.h = window.innerHeight;
    breakpoint.is = getBreakpoint(window.innerWidth);
  }, 200);

  onMounted(() => {
    window.addEventListener("resize", resizeListener);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", resizeListener);
  });

  return breakpoint;
}
