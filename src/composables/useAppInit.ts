import { ref } from "vue";

const isReady = ref(false);
const progress = ref(0);
const loadingText = ref("正在初始化...");

export function useAppInit() {
  const setReady = (ready: boolean) => {
    isReady.value = ready;
  };

  const setProgress = (val: number) => {
    progress.value = Math.min(100, Math.max(0, val));
  };

  const setLoadingText = (text: string) => {
    loadingText.value = text;
  };

  return {
    isReady,
    progress,
    loadingText,
    setReady,
    setProgress,
    setLoadingText,
  };
}
