<script setup>
    import { defineProps } from 'vue';

    const emit = defineEmits(['initializeWallet'])
    const props = defineProps({
        wallet: Object
    });
</script>

<template>
    <div class="wallet-list">
        <a href="javascript: void(0);" @click="emit('initializeWallet', wallet.wallet_name, wallet.imageUrl)">
            <div>
            <span class="small-ball"></span>
            <span class="font-700">{{ wallet.wallet_name }}</span>
            </div>
            <div>
                <img :src="wallet.imageUrl" alt="" class="img" width="40">
            </div>
        </a>
    </div>
</template>