<script setup>
  import Navbar  from '@/components/Navbar.vue';
  import Footer  from '@/components/Footer.vue';
  import { RouterView, useRoute } from 'vue-router';
  import { onMounted } from 'vue';
  // import WOW from './assets/wow.js';

  // onMounted(() => {
  //   new WOW({
  //     boxClass: 'wow',
  //     animateClass: 'animated',
  //     offset: 0,
  //     mobile: true,
  //     live: true
  //   }).init()
  // })
  const route = useRoute()

  onMounted(() => {
    if (window.WOW) {
      new window.WOW({ boxClass: 'wow', animateClass: 'animated', offset: 0, mobile: true, live: true }).init()
    }
  })
</script>

<template>
  <Navbar v-if="!route.meta?.noLayout" />
  <RouterView />
  <Footer v-if="!route.meta?.noLayout" />
</template>