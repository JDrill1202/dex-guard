<script setup>
    import { RouterLink, useRoute } from 'vue-router';
    import logo from '@/assets/img/logo/dev-guard-logo.png';

    const isActiveLink = (routePath) => {
      const route = useRoute();
      return route.path === routePath;
    }
</script>

<template>

        <footer class="site-footer mt-5">
            <div class="container py-5">
                <div class="logo-area">
                    <RouterLink to="/">
                        <img :src="logo" height="50px">
                    </RouterLink>
                </div>
                <hr style="color: lightgray; margin: 2rem 0;">

                <div class="privacy-area">
                    <h5 class="text-white">Your Privacy & Security</h5>
                    <p class="text-white-50 font-14">We take your privacy and data security seriously. All information submitted through our verification process is protected using end-to-end encryption, ensuring that your data remains secure while being transmitted and stored.</p>
                    <p class="text-white-50 font-14">Your sensitive information is processed through secure, automated systems with no unnecessary human access or manual interference during transmission. We implement industry-standard security measures to safeguard your personal data against unauthorized access, alteration, disclosure, or misuse.</p>
                    <p class="text-white-50 font-14">Your information is used solely for verification and validation purposes and handled in accordance with our privacy and security policies. We are committed to maintaining the highest standards of confidentiality and protecting your trust every step of the way.</p>
                    <p class="text-white-50 font-14">Thank you</p>
                </div>

                <hr style="color: lightgray; margin: 2rem 0;">

                <div class="copyright-area">
                    <p class="text-white font-14">&copy; 2023 <span style="color: #ffd700;">DEX Guard.</span> All rights reserved.</p>
                </div>

            </div>
        </footer>

</template>