<script setup>
    import { RouterLink } from 'vue-router';
</script>

<template>
    <section class="text-center flex flex-col justify-center items-center h-96 position-relative" style="z-index: 99;">
      <i class="pi pi-exclamation-triangle text-warning mb-5" style="font-size: 50px;"></i>
      <h1 class="text-6xl font-bold mb-4 text-white">404 Not Found</h1>
      <p class="text-xl mb-5 text-white-50">This page does not exist</p>
      <RouterLink
        to="/"
        class="text-white bg-warning rounded-md px-3 py-2 mt-4"
        >Go Back</RouterLink
      >
    </section>
</template>