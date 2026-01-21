import { ref } from "vue";
import Fuse from "fuse.js";
import { useAppInit } from "./useAppInit";

export interface CommandItem {
  n: string; // name
  p: string; // path
  d: string; // description
  k?: string[]; // keywords
}

const commandIndex = ref<CommandItem[]>([]);
const fuse = ref<Fuse<CommandItem>>();

export function useCommandSearch() {
  const isLoading = ref(false);
  const { setReady, setProgress, setLoadingText } = useAppInit();

  const init = async () => {
    if (commandIndex.value.length > 0) {
      setReady(true);
      return;
    }

    try {
      isLoading.value = true;
      setLoadingText("正在获取核心索引...");
      setProgress(10);

      const response = await fetch("/command_index.json");
      if (!response.ok) throw new Error("Failed to load command index");

      const contentLength = response.headers.get("Content-Length");
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      let loaded = 0;

      const reader = response.body?.getReader();
      if (!reader) {
        // Fallback if reader is not available
        const data = await response.json();
        commandIndex.value = data;
      } else {
        const chunks: Uint8Array[] = [];
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          loaded += value.length;

          if (total) {
            const currentProgress = 10 + (loaded / total) * 70; // 10% to 80% range
            setProgress(currentProgress);
            setLoadingText(
              `加载数据中... ${Math.round((loaded / 1024 / 1024) * 10) / 10}MB`,
            );
          }
        }

        const allChunks = new Uint8Array(loaded);
        let offset = 0;
        for (const chunk of chunks) {
          allChunks.set(chunk, offset);
          offset += chunk.length;
        }

        const text = new TextDecoder().decode(allChunks);
        const data = JSON.parse(text);
        commandIndex.value = data;
      }

      setLoadingText("正在构建搜索索引...");
      setProgress(85);

      fuse.value = new Fuse(commandIndex.value, {
        keys: [
          { name: "n", weight: 0.7 },
          { name: "d", weight: 0.3 },
        ],
        threshold: 0.3,
        includeScore: true,
      });

      setProgress(100);
      setLoadingText("准备就绪");

      // Delay slightly for smooth transition
      setTimeout(() => {
        setReady(true);
      }, 500);
    } catch (e) {
      console.error("Failed to load command index", e);
      setLoadingText("加载失败，请刷新重试");
    } finally {
      isLoading.value = false;
    }
  };

  const search = (query: string): CommandItem[] => {
    if (!fuse.value || !query.trim()) return [];

    return fuse.value.search(query).map((r) => r.item);
  };

  const searchDirect = (query: string): CommandItem[] => {
    if (!commandIndex.value) return [];
    const lower = query.toLowerCase();
    return commandIndex.value.filter((c) => c.n.toLowerCase() === lower);
  };

  return {
    commandIndex,
    search,
    searchDirect,
    isLoading,
    init,
  };
}
