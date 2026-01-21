<template>
  <v-container class="py-12">
    <div class="text-center mb-12">
      <h1 class="text-h4 text-sm-h2 font-weight-black mb-4 gradient-text">
        Linux 命令助手
      </h1>
      <p class="text-body-1 text-sm-h6 text-medium-emphasis">
        高效搜索和理解 Linux 命令。
      </p>
    </div>

    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card rounded="xl" elevation="2" class="mb-12">
          <v-text-field
            v-model="query"
            placeholder="输入命令名称或描述..."
            prepend-inner-icon="mdi-magnify"
            variant="solo"
            flat
            hide-details
            clearable
            rounded="xl"
            class="search-input"
            @focus="showResults = true"
            @blur="handleBlur"
          >
            <template #append-inner v-if="isLoading">
              <v-progress-circular
                indeterminate
                size="24"
                width="2"
                color="primary"
              />
            </template>
          </v-text-field>

          <v-expand-transition>
            <v-list
              v-if="showResults && results.length > 0"
              class="results-list"
            >
              <v-list-item
                v-for="cmd in results"
                :key="cmd.n"
                :to="'/command/' + cmd.n"
                @click="showResults = false"
              >
                <v-list-item-title
                  class="font-weight-bold text-primary font-mono"
                >
                  {{ cmd.n }}
                </v-list-item-title>
                <v-list-item-subtitle>{{ cmd.d }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-expand-transition>
        </v-card>

        <v-card rounded="xl" elevation="2" class="pa-6">
          <div class="d-flex align-center mb-4">
            <v-icon icon="mdi-brain" color="primary" class="mr-2" />
            <h3 class="text-h6 font-weight-bold">智能查询</h3>
          </div>
          <p class="text-body-2 text-medium-emphasis mb-4">
            粘贴一段 Shell 脚本或命令，自动识别包含的工具。
          </p>

          <v-textarea
            v-model="smartQueryInput"
            placeholder="例如: tar -czvf archive.tar.gz"
            variant="outlined"
            rounded="lg"
            rows="4"
            auto-grow
            class="font-mono mb-4"
          />

          <v-expand-transition>
            <div v-if="matchedCommands.length > 0">
              <p
                class="text-caption font-weight-bold text-medium-emphasis mb-2"
              >
                检测到的命令:
              </p>
              <div class="d-flex flex-wrap gap-2">
                <v-chip
                  v-for="cmd in matchedCommands"
                  :key="cmd.n"
                  :to="'/command/' + cmd.n"
                  color="primary"
                  variant="tonal"
                  link
                  class="font-mono"
                >
                  {{ cmd.n }}
                </v-chip>
              </div>
            </div>
          </v-expand-transition>
        </v-card>

        <div class="text-center mt-8">
          <v-btn to="/list" variant="text" color="primary" class="text-none">
            浏览所有命令 <v-icon icon="mdi-arrow-right" end />
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useCommandSearch } from "@/composables/useCommandSearch";
import { useDebounceFn } from "@vueuse/core";

const query = ref("");
const smartQueryInput = ref("");
const showResults = ref(false);
const results = ref<any[]>([]);

const { search, searchDirect, commandIndex, isLoading } = useCommandSearch();

const handleSearch = useDebounceFn(() => {
  if (!query.value) {
    results.value = [];
    return;
  }
  results.value = search(query.value).slice(0, 10);
  showResults.value = true;
}, 300);

watch(query, handleSearch);

const handleBlur = () => {
  setTimeout(() => {
    showResults.value = false;
  }, 200);
};

const matchedCommands = computed(() => {
  if (!smartQueryInput.value.trim() || commandIndex.value.length === 0)
    return [];

  const tokens = smartQueryInput.value
    .split(/[\s|&;]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
  const uniqueTokens = new Set(tokens);

  const watchList: any[] = [];
  for (const token of uniqueTokens) {
    const hits = searchDirect(token);
    if (hits.length > 0) {
      watchList.push(hits[0]);
    }
  }
  return watchList;
});
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(45deg, #1867c0, #5cbbf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.font-mono {
  font-family: "JetBrains Mono", monospace !important;
}

.search-input :deep(.v-field__input) {
  font-size: 1.25rem;
  padding-top: 20px;
  padding-bottom: 20px;
}

.results-list {
  max-height: 400px;
  overflow-y: auto;
}

.gap-2 {
  gap: 8px;
}
</style>
