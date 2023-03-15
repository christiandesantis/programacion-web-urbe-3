<template>
  <h4 class="text-center">Register</h4>
  <q-page class="row justify-evenly">
        <q-form
          @submit.prevent="onSubmit"
          @reset="onReset"
          class="q-gutter-md"
          :class="{'q-pa-md': $q.screen.lt.md, 'q-mt-md': $q.screen.gt.sm}"
          :style="$q.screen.gt.sm ? 'width: 50%' : 'width: 100%'"
        >
          <q-input
            filled
            v-model="data.name"
            label="Name *"
            hint="Your first name"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type something']"
          />

          <q-input
            filled
            v-model="data.lastname"
            label="Last Name *"
            hint="Your last name"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type something']"
          />

          <q-input
            filled
            type="email"
            v-model="data.email"
            label="Email *"
            hint="Your Email Address"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type something']"
          />

          <q-input
            class="q-mt-none"
            v-model="data.password"
            filled
            :type="isPwd ? 'password' : 'text'"
            hint="Password"
            label="Password *"
            >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <q-input
            v-model="confirmPassword"
            filled
            :type="isPwdConfirm ? 'password' : 'text'"
            hint="Confirm Password"
            label="Confirm Password *"
            >
            <template v-slot:append>
              <q-icon
                :name="isPwdConfirm ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwdConfirm = !isPwdConfirm"
              />
            </template>
          </q-input>

          <!-- <q-toggle v-model="data.accept" label="I accept the license and terms" /> -->
          <q-checkbox v-model="data.accept" color="yellow-10" label="I accept the license and terms" />

          <div class="q-mt-lg q-mb-md q-ml-none">
            <q-btn label="Register" rounded type="submit" color="yellow-10" size="lg" class="q-ml-auto q-mr-auto block q-pt-sm"/>
            <!-- <q-btn label="Reset" type="reset" color="yellow-10" flat class="q-ml-sm" /> -->
          </div>
        </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth-store'

const authStore = useAuthStore()
const router = useRouter()

const $q = useQuasar()

const data = reactive({
  name: null,
  lastname: null,
  email: null,
  accept: false,
  password: null
})
const confirmPassword = ref(null)

const isPwd = ref(true)

const isPwdConfirm = ref(true)

async function onSubmit () {
  if (data.accept !== true) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: 'You need to accept the license and terms first'
    })
  } else {
    try {
      await authStore.register({
        email: data.email ?? '',
        password: data.password ?? '',
        name: data.name ?? '',
        lastname: data.lastname ?? ''
      })
      // $q.notify({
      //   color: 'green-4',
      //   textColor: 'white',
      //   icon: 'cloud_done',
      //   message: 'Has iniciado sesión!'
      // })
      router.push({ name: 'notes' })
    } catch (error) {
      console.log(error)
    }
    // const success: boolean = await register(data)
    // if (success) {
    //   $q.notify({
    //     color: 'green-4',
    //     textColor: 'white',
    //     icon: 'cloud_done',
    //     message: 'Login successful'
    //   })
    //   router.push({ name: 'seasons' })
    // }
  }
}

function onReset () {
  data.name = null
  data.lastname = null
  data.email = null
  data.accept = false
  data.password = null
  confirmPassword.value = null
}

</script>
