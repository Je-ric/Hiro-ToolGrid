<template>
  <div class="bg-gray-100 min-h-screen flex flex-col">

    <!-- Top bar -->
    <div class="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
      <router-link to="/" class="inline-flex items-center gap-1.5 text-gray-400 hover:text-blue-500 text-sm transition-colors shrink-0">
        <i class="bx bx-arrow-back text-base"></i>
        <span class="hidden sm:inline">Back</span>
      </router-link>
      <div class="w-px h-5 bg-gray-200"></div>
      <div class="min-w-0">
        <h1 class="text-lg font-bold text-gray-900 leading-tight truncate">{{ title }}</h1>
        <p v-if="subtitle" class="text-xs text-gray-400 truncate hidden sm:block">{{ subtitle }}</p>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-5 w-full max-w-screen-2xl mx-auto">
      <slot />
    </div>

  </div>
</template>

<script setup>
defineProps({
  title:    String,
  subtitle: String,
})
</script>
