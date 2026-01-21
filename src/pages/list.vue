<template>
  <v-container class="py-8">
    <div class="d-flex align-center mb-8">
      <v-btn icon="mdi-arrow-left" variant="text" to="/" class="mr-2" />
      <h1 class="text-h4 font-weight-bold">所有命令</h1>
      <v-spacer />
      <v-text-field
        v-model="searchQuery"
        prepend-inner-icon="mdi-magnify"
        label="过滤命令..."
        variant="outlined"
        density="compact"
        hide-details
        rounded="lg"
        class="max-width-300"
      />
    </div>

    <v-card rounded="xl" border flat>
      <v-data-iterator
        :items="filteredCommands"
        :items-per-page="20"
        :search="searchQuery"
      >
        <template #default="{ items }">
          <v-list lines="two">
            <template v-for="(item, i) in items" :key="item.raw.n">
              <v-list-item :to="'/command/' + item.raw.n" class="py-3">
                <template #prepend>
                  <v-avatar color="primary" variant="tonal" size="40">
                    <span class="text-caption font-weight-bold">{{
                      (item.raw.n?.[0] || "").toUpperCase()
                    }}</span>
                  </v-avatar>
                </template>
                <v-list-item-title
                  class="font-weight-bold text-primary font-mono mb-1"
                >
                  {{ item.raw.n }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-body-2">
                  {{ item.raw.d }}
                </v-list-item-subtitle>
              </v-list-item>
              <v-divider v-if="i < items.length - 1" inset />
            </template>
          </v-list>
        </template>

        <template #footer="{ page, pageCount, prevPage, nextPage }">
          <div class="d-flex align-center justify-center pa-4">
            <v-btn
              :disabled="page === 1"
              icon="mdi-chevron-left"
              variant="text"
              @click="prevPage"
            />
            <div class="mx-4 text-caption font-weight-bold">
              第 {{ page }} 页，共 {{ pageCount }} 页
            </div>
            <v-btn
              :disabled="page === pageCount"
              icon="mdi-chevron-right"
              variant="text"
              @click="nextPage"
            />
          </div>
        </template>
      </v-data-iterator>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useCommandSearch } from "@/composables/useCommandSearch";

const { commandIndex } = useCommandSearch();
const searchQuery = ref("");

const filteredCommands = computed(() => {
  return commandIndex.value;
});
</script>

<style scoped>
.max-width-300 {
  max-width: 300px;
}
.font-mono {
  font-family: "JetBrains Mono", monospace !important;
}
</style>
