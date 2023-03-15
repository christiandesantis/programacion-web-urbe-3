<template>
  <h4 class="text-center">Login</h4>
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
            type="email"
            v-model="data.email"
            label="Email *"
            hint="Your Email Address"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type something']"
          />

          <q-input
            v-model="data.password"
            hint="Your Password"
            filled
            :type="isPwd ? 'password' : 'text'"
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

          <div class="q-mt-lg q-mb-md q-ml-none">
            <q-btn label="Login" rounded type="submit" color="yellow-10" size="lg" class="q-ml-auto q-mr-auto block q-pt-sm"/>
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
  email: null,
  password: null
})

const isPwd = ref(true)

async function onSubmit () {
  try {
    await authStore.logIn({
      email: data.email ?? '',
      password: data.password ?? ''
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
  // const success: boolean = await login(data)
  // if (success !== null) {
  //   $q.notify({
  //     color: 'green-4',
  //     textColor: 'white',
  //     icon: 'cloud_done',
  //     message: 'Login Successful'
  //   })
  //   if ($cookies.isKey('f1f-redirect')) {
  //     router.push($cookies.get('f1f-redirect'))
  //     $cookies.remove('f1f-redirect')
  //   } else {
  //     router.push({ name: 'seasons' })
  //   }
  // }
}

function onReset () {
  data.email = null
  data.password = null
}

</script>
