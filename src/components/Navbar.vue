<script setup>
    import { RouterLink, useRoute } from 'vue-router';
    import logo from '@/assets/img/logo/dev-guard-logo.png';

    const isActiveLink = (routePath) => {
      const route = useRoute();
      return route.path === routePath;
    }
</script>

<template>

        <div class="dots-container">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        </div>
        
        <div class="grid-overlay"></div>

        <div class="header-area">
            <RouterLink to="/">
                <img v-bind:src="logo" height="70px">
            </RouterLink>
        </div>

</template>