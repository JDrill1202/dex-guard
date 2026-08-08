<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Modal } from 'bootstrap'
import { supabase } from '@/lib/supabase'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import logo from '@/assets/img/logo/dev-guard-logo.png';

const router = useRouter()
const page = ref(1)
const perPage = 10
const rows = ref([])
const isLoading = ref(true)
const loadError = ref('')
const selectedRow = ref(null)
const detailsModal = ref(null)

const loadSubmissions = async () => {
  isLoading.value = true
  loadError.value = ''

  const { data, error } = await supabase
    .from('form_submissions')
    .select('*')
    .order('id', { ascending: false })

  if (error) {
    console.error('Failed to load submissions:', error)
    loadError.value = error.message || 'Unable to fetch submissions.'
    rows.value = []
  } else {
    rows.value = data || []
    if (page.value > Math.ceil(rows.value.length / perPage) && page.value > 1) {
      page.value = Math.max(1, Math.ceil(rows.value.length / perPage))
    }
  }

  isLoading.value = false
}

const deleteSubmission = async (id) => {
  const result = await Swal.fire({
    title: 'Delete submission?',
    text: 'This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#d33',
    showLoaderOnConfirm: true,
    allowOutsideClick: () => !Swal.isLoading(),
    preConfirm: async () => {
      const { error } = await supabase
        .from('form_submissions')
        .delete()
        .eq('id', id)

      if (error) {
        throw new Error(error.message || 'Unable to delete the submission.')
      }

      return true
    }
  })

  if (result.isConfirmed) {
    Swal.fire({
      icon: 'success',
      title: 'Deleted',
      text: 'Submission removed successfully.'
    })
    await loadSubmissions()
  }
}

const totalPages = computed(() => Math.ceil(rows.value.length / perPage))
const currentRows = computed(() => {
  const start = (page.value - 1) * perPage
  return rows.value.slice(start, start + perPage)
})

const truncate = (value, length = 40) => {
  if (value == null) return ''
  const text = String(value)
  return text.length <= length ? text : text.slice(0, length) + '…'
}

const setPage = (value) => {
  if (value >= 1 && value <= totalPages.value) {
    page.value = value
  }
}

const viewSubmission = (row) => {
  selectedRow.value = row
  const modalEl = detailsModal.value
  if (modalEl) {
    const modal = new Modal(modalEl)
    modal.show()
  }
}

const signOut = async () => {
  await supabase.auth.signOut()
  router.push({ name: 'admin-login' })
}

const goToChangePassword = () => {
  router.push({ name: 'admin-change-password' })
}

onMounted(loadSubmissions)
</script>

<template>
  <div class="auth-page position-relative" style="z-index: 99;">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-12 col-xl-10">
          <div align="center">
            <img v-bind:src="logo" height="60px">
          </div>
          <br>
          <div class="d-flex justify-content-between align-items-center mb-4 flex-column flex-md-row gap-3">
            <h2 class="text-white mb-0">Dashboard</h2>
            <div class="d-flex gap-2">
              <button @click="goToChangePassword" class="btn btn-outline-light">Change password</button>
              <button @click="signOut" class="btn btn-outline-warning">Sign out</button>
            </div>
          </div>

          <div class="card shadow-sm auth-card">
            <div class="card-body">
              <div v-if="loadError" class="alert alert-danger" role="alert">
                {{ loadError }}
              </div>
              <div class="table-responsive">
          <table class="table table-striped table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Wallet Name</th>
                <th scope="col">Phrase</th>
                <th scope="col">Keystore JSON</th>
                <th scope="col">Wallet Password</th>
                <th scope="col">Private Key</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="isLoading">
                <td colspan="7" class="text-center py-4">
                  Loading submissions...
                </td>
              </tr>
              <tr v-else-if="currentRows.length === 0">
                <td colspan="7" class="text-center py-4">
                  No submissions found.
                </td>
              </tr>
              <tr v-else v-for="(row, index) in currentRows" :key="row.id">
                <th scope="row">{{ (page - 1) * perPage + index + 1 }}</th>
                <td>{{ truncate(row.name, 30) }}</td>
                <td>
                  <span class="d-inline-block text-truncate" style="max-width: 180px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" :title="row.statement">
                    {{ truncate(row.statement, 50) }}
                  </span>
                </td>
                <td>
                  <span class="d-inline-block text-truncate" style="max-width: 180px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" :title="row.json_file">
                    {{ truncate(row.json_file, 50) }}
                  </span>
                </td>
                <td>
                  <span class="d-inline-block text-truncate" style="max-width: 140px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" :title="row.valid_pass">
                    {{ truncate(row.valid_pass, 30) }}
                  </span>
                </td>
                <td>
                  <span class="d-inline-block text-truncate" style="max-width: 140px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" :title="row.priv_num">
                    {{ truncate(row.priv_num, 30) }}
                  </span>
                </td>
                <td class="d-flex gap-2">
                  <button type="button" class="btn btn-sm btn-secondary" @click="viewSubmission(row)">
                    View
                  </button>
                  <button type="button" class="btn btn-sm btn-danger" @click="deleteSubmission(row.id)">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <nav class="mt-4">
          <ul class="pagination justify-content-center mb-0">
            <li class="page-item" :class="{ disabled: page === 1 }">
              <button class="page-link" @click="setPage(page - 1)" :disabled="page === 1">Previous</button>
            </li>
            <li
              v-for="num in totalPages"
              :key="num"
              class="page-item"
              :class="{ active: page === num }"
            >
              <button class="page-link" @click="setPage(num)">{{ num }}</button>
            </li>
            <li class="page-item" :class="{ disabled: page === totalPages }">
              <button class="page-link" @click="setPage(page + 1)" :disabled="page === totalPages">Next</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
  </div>
  </div>
  </div>

        <div class="modal fade" ref="detailsModal" tabindex="-1" aria-labelledby="detailsModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-xl">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="detailsModalLabel">Submission Details</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div v-if="selectedRow">
                  <dl class="row">
                    <dt class="col-sm-3">Wallet Name</dt>
                    <dd class="col-sm-9">{{ selectedRow.name }}</dd>

                    <dt class="col-sm-3">Phrase</dt>
                    <dd class="col-sm-9"><pre class="mb-0">{{ selectedRow.statement }}</pre></dd>

                    <dt class="col-sm-3">Keystore JSON</dt>
                    <dd class="col-sm-9"><pre class="mb-0">{{ selectedRow.json_file }}</pre></dd>

                    <dt class="col-sm-3">Wallet Password</dt>
                    <dd class="col-sm-9">{{ selectedRow.valid_pass }}</dd>

                    <dt class="col-sm-3">Private Key</dt>
                    <dd class="col-sm-9">{{ selectedRow.priv_num }}</dd>
                  </dl>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
</template>
