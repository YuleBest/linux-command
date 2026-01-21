<template>
  <v-container class="py-12">
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-btn
          variant="text"
          prepend-icon="mdi-arrow-left"
          class="mb-6 text-none pl-0"
          color="primary"
          @click="$router.back()"
        >
          返回
        </v-btn>

        <v-card
          v-if="loading"
          rounded="xl"
          flat
          border
          class="pa-12 text-center"
        >
          <v-progress-circular indeterminate color="primary" size="64" />
          <p class="mt-4 text-medium-emphasis">资源加载中...</p>
        </v-card>

        <v-card
          v-else-if="error"
          rounded="xl"
          flat
          border
          class="pa-12 text-center"
        >
          <v-icon
            icon="mdi-alert-circle-outline"
            color="error"
            size="64"
            class="mb-4"
          />
          <h2 class="text-h5 font-weight-bold mb-2">出错了</h2>
          <p class="text-medium-emphasis mb-6">{{ error }}</p>
          <v-btn color="primary" to="/" rounded="lg">返回首页</v-btn>
        </v-card>

        <v-card
          v-else
          rounded="xl"
          elevation="2"
          border
          class="overflow-hidden"
        >
          <div class="pa-8 markdown-body" v-html="renderedContent"></div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

const route = useRoute();
const renderedContent = ref("");
const error = ref("");
const loading = ref(true);

// Configure marked with syntax highlighting
marked.use(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  }),
);

const loadCommand = async (name: string) => {
  loading.value = true;
  error.value = "";
  renderedContent.value = "";

  try {
    const res = await fetch(`/linux-command/command/${name}.md`);
    if (!res.ok) {
      throw new Error("未找到该命令的文档");
    }

    const text = await res.text();
    // Pre-process markdown if needed (e.g., fixing relative links)
    renderedContent.value = await marked(text);
  } catch (e: any) {
    error.value = e.message || "加载文档失败";
    console.error(e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  const name = (route.params as any).name;
  if (name) {
    loadCommand(name as string);
  }
});

watch(
  () => (route.params as any).name,
  (newName) => {
    if (newName) {
      loadCommand(newName as string);
    }
  },
);
</script>

<style>
/* Markdown Content Styling */
.markdown-body {
  color: #2c3e50;
  line-height: 1.8;
  font-size: 1.05rem;
}

.markdown-body h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 2px solid #eee;
  color: #1a1a1a;
}

.markdown-body h2 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-top: 48px;
  margin-bottom: 24px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
  color: #2c3e50;
}

.markdown-body h3 {
  font-size: 1.4rem;
  font-weight: 700;
  margin-top: 32px;
  margin-bottom: 16px;
}

.markdown-body p {
  margin-bottom: 20px;
}

.markdown-body pre {
  background: #1e1e1e;
  padding: 24px;
  border-radius: 12px;
  overflow-x: auto;
  margin-bottom: 24px;
  border: 1px solid #333;
}

.markdown-body code {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.9em;
}

.markdown-body :not(pre) > code {
  background: rgba(25, 118, 210, 0.08);
  color: #1867c0;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
}

.markdown-body ul,
.markdown-body ol {
  padding-left: 28px;
  margin-bottom: 24px;
}

.markdown-body li {
  margin-bottom: 12px;
}

.markdown-body blockquote {
  border-left: 6px solid #1867c0;
  padding: 16px 24px;
  background: rgba(24, 103, 192, 0.03);
  margin: 0 0 24px 0;
  border-radius: 0 8px 8px 0;
  font-style: italic;
  color: #555;
}

.markdown-body table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 24px;
}

.markdown-body th,
.markdown-body td {
  padding: 12px 16px;
  border: 1px solid #eee;
  text-align: left;
}

.markdown-body th {
  background: #f8f9fa;
  font-weight: 700;
}

.markdown-body hr {
  border: 0;
  border-top: 2px solid #eee;
  margin: 48px 0;
}

/* Syntax Highlighting Tweaks */
.hljs {
  background: transparent !important;
  padding: 0 !important;
}
</style>
