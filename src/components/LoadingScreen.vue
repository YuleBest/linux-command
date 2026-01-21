<template>
  <v-overlay
    :model-value="!isReady"
    persistent
    class="align-center justify-center loading-overlay"
    scrim="surface"
    no-click-animation
  >
    <div class="text-center loading-container">
      <div class="mb-8 logo-glow">
        <v-icon icon="mdi-console" size="84" color="primary" />
      </div>

      <h2 class="text-h4 font-weight-black mb-8 gradient-text">
        Linux 命令助手
      </h2>

      <div class="loading-bar-wrapper mb-4">
        <v-progress-linear
          v-model="progress"
          color="primary"
          height="8"
          rounded="pill"
          striped
        />
      </div>

      <p class="text-subtitle-1 text-medium-emphasis mb-2 font-weight-medium">
        {{ loadingText }}
      </p>

      <div class="text-caption text-disabled font-mono">
        {{ Math.round(progress) }}%
      </div>
    </div>
  </v-overlay>
</template>

<script setup lang="ts">
import { useAppInit } from "@/composables/useAppInit";

const { isReady, progress, loadingText } = useAppInit();
</script>

<style scoped>
.loading-overlay {
  z-index: 9999 !important;
  opacity: 1 !important;
}

.loading-container {
  width: 100vw;
  max-width: 400px;
  padding: 24px;
}

.loading-bar-wrapper {
  width: 280px;
  margin: 0 auto;
}

.gradient-text {
  background: linear-gradient(45deg, #1867c0, #5cbbf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.logo-glow {
  animation: pulse-glow 2s infinite ease-in-out;
}

@keyframes pulse-glow {
  0% {
    transform: scale(1);
    filter: drop-shadow(0 0 0px rgba(24, 103, 192, 0));
  }
  50% {
    transform: scale(1.05);
    filter: drop-shadow(0 0 20px rgba(24, 103, 192, 0.3));
  }
  100% {
    transform: scale(1);
    filter: drop-shadow(0 0 0px rgba(24, 103, 192, 0));
  }
}

.font-mono {
  font-family: "JetBrains Mono", monospace !important;
}
</style>
