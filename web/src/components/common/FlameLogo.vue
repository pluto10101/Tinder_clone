<script setup lang="ts">
defineProps<{ size?: number; color?: string }>();
</script>

<template>
  <svg
    :width="size ?? 32"
    :height="size ?? 32"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="flame-g" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#FD297B" />
        <stop offset="60%" stop-color="#FF5864" />
        <stop offset="100%" stop-color="#FF655B" />
      </linearGradient>
    </defs>
    <path
      d="M12 2C12 2 6 8 6 13.5C6 17.6 9 21 12 21C15 21 18 17.6 18 13.5C18 10 15.5 8 15.5 8C15.5 8 15 12 13 12C13 12 14 7 12 2Z"
      :fill="color ?? 'url(#flame-g)'"
    />
  </svg>
</template>
