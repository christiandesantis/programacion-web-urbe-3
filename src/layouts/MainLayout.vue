<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-yellow-10">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Tarea 3 - Bloc de notas
        </q-toolbar-title>

        <div>
          <q-btn flat round color="white" icon="logout" @click="signOut()" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="250"
      :breakpoint="400"
    >
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
        <q-list>
          <q-item-label
            header
            class="row"
          >
            <div class="col-6 d-inline text-left" style="line-height: 30px;">
              Carpetas
            </div>
            <div class="col-6 d-inline text-right">
              <q-btn outline round color="grey=8" size="xs" icon="add" @click="newDirDialog = true" />
            </div>
          </q-item-label>

          <q-item
            clickable
            v-for="(folder, i) in folders"
            :key="i"
            v-ripple
            :active="link === folder.name"
            @click="link = folder.name"
            active-class="my-menu-link"
          >
            <q-item-section
              avatar
            >
              <q-icon name="folder" color="yellow-10" />
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ `${folder.name}` }}</q-item-label>
              <q-item-label caption>{{ `carpeta` }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn flat round color="grey-8" size="xs" icon="delete" @click="deleteFolder(folder.name)" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
      <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
        <div class="absolute-bottom bg-transparent text-center">
          <q-avatar size="56px" class="q-mb-sm" color="orange-10" text-color="white">{{ user.displayName.substring(0, 1) }}</q-avatar>
          <div class="text-weight-bold">{{ user.displayName }}</div>
          <div>{{ user.email }}</div>
        </div>
      </q-img>
    </q-drawer>

    <q-dialog v-model="newDirDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Nueva Carpeta</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="newDirName" color="yellow-10" autofocus @keyup.enter="newDirDialog = false" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancelar" color="yellow-10" v-close-popup />
          <q-btn flat label="Crear" color="yellow-10" @click="createFolder()" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-page-container>
      <router-view :currentFolder="link" />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '../stores/auth-store'
import { useRouter } from 'vue-router'
import { db, auth } from '../composables/firebase'
import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore'

onMounted(async () => {
  // const collectionsRef = collection(db, `${auth.currentUser?.providerId}`)
  // const docsSnap = await getDocs(collectionsRef)
  // docsSnap.forEach(doc => { console.log(doc.data()) })

  // await setDoc(doc(collectionsRef, 'Root'), {
  //   body: '<h3>Lorem Ipsum</h3>'
  // })

  await fetchFolders()
  link.value = folders.value[0].name
})

const router = useRouter()

const authStore = useAuthStore()

const newDirDialog = ref(false)

const newDirName = ref('')

const link = ref('')

auth.onAuthStateChanged(user => {
  authStore.fetchUser(user)
})

const user = computed(() => {
  return authStore.user
})

async function signOut () {
  await authStore.logOut()
  router.push('/login')
}

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const folders = ref<{ name: string }[]>([])

async function fetchFolders () {
  const collectionsRef = collection(db, `${auth.currentUser?.uid}`)
  const docsSnap = await getDocs(collectionsRef)
  if (docsSnap) {
    folders.value = []
    docsSnap.forEach(doc => {
      folders.value.push({ name: doc.id })
      // console.log(doc.data())
    })
  }
}

async function createFolder () {
  const collectionsRef = collection(db, `${auth.currentUser?.uid}`)
  await setDoc(doc(collectionsRef, newDirName.value), {})
  await fetchFolders()
}

async function deleteFolder (docName: string) {
  await deleteDoc(doc(db, `${auth.currentUser?.uid}`, docName))
  await fetchFolders()
}

// watch(
//   () => link.value,
//   (newVal) => {

//   }
// )
</script>

<style lang="sass">
.my-menu-link
  color: white
  background: $primary

.my-menu-link .text-caption
  color: #fff

.my-menu-link i
  color: #fff
</style>
