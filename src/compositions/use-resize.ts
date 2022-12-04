import { onMounted, onUnmounted } from "vue";
import debounce from "lodash.debounce";

export default function useResize(fn: () => void) {
  const resizeListener = debounce(() => {
    fn();
  }, 200);

  onMounted(() => {
    window.addEventListener("resize", resizeListener);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", resizeListener);
  });
}
