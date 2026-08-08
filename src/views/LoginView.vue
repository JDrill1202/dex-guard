<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import logo from '@/assets/img/logo/dev-guard-logo.png';

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

onMounted(async () => {
  const { data } = await supabase.auth.getSession()
  if (data.session) {
    router.replace({ name: 'admin-dashboard' })
  }
})

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    loading.value = false

    if (authError) {
      error.value = authError.message
      return
    }

    if (data.session) {
      router.push({ name: 'admin-dashboard' })
      return
    }

    error.value = 'Unable to sign in. Please check your credentials.'
  } catch (fetchError) {
    loading.value = false
    console.error('Supabase login error:', fetchError)
    error.value = fetchError?.message || 'Network error. Failed to fetch.'
  }
}
</script>

<template>
  <div class="auth-page position-relative" style="z-index: 99;">
    <div class="container">
      <div class="row justify-content-center align-items-center min-vh-100">
        <div class="col-sm-10 col-md-8 col-lg-6 col-xl-5">

          <div align="center">
            <img v-bind:src="logo" height="70px">
          </div>
          <br>

          <div class="card shadow-sm auth-card">
            <div class="card-body">
            <h3 class="card-title mb-4 text-center">Sign in</h3>

            <div v-if="error" class="alert alert-danger" role="alert">
              {{ error }}
            </div>

            <form @submit.prevent="handleLogin" novalidate>
              <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input
                  id="email"
                  type="email"
                  class="form-control"
                  v-model="email"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div class="mb-4">
                <label for="password" class="form-label">Password</label>
                <input
                  id="password"
                  type="password"
                  class="form-control"
                  v-model="password"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
