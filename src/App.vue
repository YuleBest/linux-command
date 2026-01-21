<template>
  <v-app>
    <v-app-bar flat border color="surface" height="64">
      <v-container class="d-flex align-center">
        <v-btn
          to="/"
          variant="text"
          class="text-none font-weight-bold text-h6"
          color="primary"
          rounded="lg"
        >
          <v-icon start icon="mdi-console" />
          Linux 命令助手
        </v-btn>

        <v-spacer />

        <v-btn to="/" variant="text" rounded="lg" class="mr-2">搜索</v-btn>
        <v-btn to="/list" variant="text" rounded="lg">所有命令</v-btn>
      </v-container>
    </v-app-bar>

    <v-main class="bg-grey-lighten-4">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
//
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
