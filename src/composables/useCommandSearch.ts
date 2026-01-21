import { ref, onMounted } from "vue";
import Fuse from "fuse.js";

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

  onMounted(async () => {
    if (commandIndex.value.length > 0) return;

    try {
      isLoading.value = true;
      const res = await fetch("/command_index.json");
      const data = await res.json();
      commandIndex.value = data;

      fuse.value = new Fuse(data, {
        keys: [
          { name: "n", weight: 0.7 },
          { name: "d", weight: 0.3 },
        ],
        threshold: 0.3,
        includeScore: true,
      });
    } catch (e) {
      console.error("Failed to load command index", e);
    } finally {
      isLoading.value = false;
    }
  });

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
  };
}
