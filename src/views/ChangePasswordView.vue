<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import logo from '@/assets/img/logo/dev-guard-logo.png'

const router = useRouter()
const newPassword = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)

const handleChangePassword = async () => {
  error.value = ''
  success.value = ''

  if (!newPassword.value || newPassword.value.length < 6) {
    error.value = 'Password must be at least 6 characters long.'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'
    return
  }

  loading.value = true

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword.value,
  })

  loading.value = false

  if (updateError) {
    error.value = updateError.message || 'Unable to update your password.'
    return
  }

  success.value = 'Password updated successfully.'
  newPassword.value = ''
  confirmPassword.value = ''
}

const goBack = () => {
  router.push({ name: 'admin-dashboard' })
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
              <h3 class="card-title mb-4 text-center">Change password</h3>

              <div v-if="error" class="alert alert-danger" role="alert">
                {{ error }}
              </div>

              <div v-if="success" class="alert alert-success" role="alert">
                {{ success }}
              </div>

              <form @submit.prevent="handleChangePassword" novalidate>
                <div class="mb-3">
                  <label for="newPassword" class="form-label">New password</label>
                  <input
                    id="newPassword"
                    type="password"
                    class="form-control"
                    v-model="newPassword"
                    placeholder="Enter a new password"
                    required
                  />
                </div>

                <div class="mb-4">
                  <label for="confirmPassword" class="form-label">Confirm password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    class="form-control"
                    v-model="confirmPassword"
                    placeholder="Re-enter your new password"
                    required
                  />
                </div>

                <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Update password
                </button>
              </form>

              <div class="mt-3 text-center">
                <button type="button" class="btn btn-link p-0" @click="goBack">
                  Back to dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
