<script setup>
    import { defineProps } from 'vue';

    const emit = defineEmits(['initializeWallet'])
    const props = defineProps({
        wallet: Object
    });
</script>

<template>
    <div class="wallet-list">
        <a href="javascript: void(0);" @click="emit('initializeWallet', wallet.wallet_name, wallet.wallet_img)">
            <div>
            <span class="small-ball"></span>
            <span class="font-700">{{ wallet.wallet_name }}</span>
            </div>
            <div>
                <img v-bind:src="'./src/assets/'+wallet.wallet_img" alt="" class="img" width="40">
            </div>
        </a>
    </div>
</template>