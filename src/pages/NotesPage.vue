<template>
  <q-page class="q-pa-md q-ml-auto q-mr-auto" style="max-width: 800px;">
    <div class="q-mt-md">
      <div class="text-h4"><q-icon class="q-mr-sm" name="folder" color="yellow-10" size="xl" />{{ currentFolder }}</div>
    </div>

    <div class="row justify-around q-mt-lg">
      <div v-for="(document, i) in documents" :key="i" class="col-md-4 q-pa-md">
        <q-card flat bordered class="document-card" @click="openDocument(document)">
          <q-item>
            <q-item-section avatar>
              <q-avatar>
                <q-icon name="description" size="md"></q-icon>
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ document.title }}</q-item-label>
              <q-item-label caption>
                Abrir
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-separator />

          <q-card-section horizontal>
            <q-card-section>
              <div v-html="document.body"></div>
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>

  <q-page-sticky position="bottom-right" :offset="[16, 16]">
    <q-btn fab icon="add" rounded color="yellow-10" size="lg" @click="newDocDialog = true"/>
  </q-page-sticky>

  <q-dialog v-model="newDocDialog" persistent>
    <q-card style="min-width: 750px">
      <q-card-section>
        <div class="text-h6">Nuevo Documento</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="q-mb-md">
          <q-input
            dense
            v-model="newDocTitle"
            color="yellow-10"
            autofocus
            @keyup.enter="newDocDialog = false"
            hint="Título"
            label="Título"
            />
        </div>

        <q-editor
          v-model="newDocBody"
          :definitions="{
            bold: {label: 'Bold', icon: (null as unknown as string), tip: 'My bold tooltip'}
          }"
        />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancelar" color="yellow-10" v-close-popup />
        <q-btn flat label="Crear" color="yellow-10" @click="createDoc()" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="updateDocDialog" persistent>
    <q-card style="min-width: 750px">
      <q-card-section>
        <div class="text-h6">Documento</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="q-mb-md">
          <q-input
            dense
            v-model="docTitle"
            color="yellow-10"
            autofocus
            @keyup.enter="updateDocDialog = false"
            hint="Título"
            label="Título"
            />
        </div>

        <q-editor
          v-model="docBody"
          :definitions="{
            bold: {label: 'Bold', icon: (null as unknown as string), tip: 'My bold tooltip'}
          }"
        />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat icon="delete" label="Eliminar" color="red-8" @click="deleteDocument()" style="margin-right: 400px" v-close-popup/>
        <q-btn flat label="Cancelar" color="yellow-10" v-close-popup />
        <q-btn flat label="Guardar" color="yellow-10" @click="updateDoc()" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore'
import { auth, db } from 'src/composables/firebase'
import { useAuthStore } from 'src/stores/auth-store'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface FolderProps {
  currentFolder: string;
}
const props = withDefaults(defineProps<FolderProps>(), {
  currentFolder: ''
})

const currentFolder = computed(() => props.currentFolder)

const authStore = useAuthStore()
const user = computed(() => {
  return authStore.user
})

onMounted(async () => {
  if (user.value.uid === null) router.push({ name: 'index' })
  await fetchDocs()
})

const documents = ref<{ title: string, body: string }[]>([])

async function fetchDocs () {
  console.log('Executing fetchDocs', currentFolder.value)
  const collectionsRef = collection(db, `${auth.currentUser?.uid}`, `${currentFolder.value}`, 'data')
  const docsSnap = await getDocs(collectionsRef)
  console.log(docsSnap)
  if (docsSnap) {
    documents.value = []
    docsSnap.forEach(doc => {
      console.log(doc.data())
      documents.value.push({ title: doc.id, body: doc.data().body })
      // console.log(doc.data())
    })
  }
}

watch(
  () => currentFolder.value,
  async () => {
    await fetchDocs()
  }
)

const updateDocDialog = ref(false)
let originalDocTitle = ''
const docTitle = ref('')
const docBody = ref('')

function openDocument (documentObject: { title: string, body: string }) {
  updateDocDialog.value = true
  originalDocTitle = documentObject.title
  docTitle.value = documentObject.title
  docBody.value = documentObject.body
}

async function updateDoc () {
  const collectionsRef = collection(db, `${auth.currentUser?.uid}`, `${currentFolder.value}`, 'data')
  await setDoc(doc(collectionsRef, `${docTitle.value}`), {
    body: docBody.value
  })
  await fetchDocs()
  originalDocTitle = ''
  docTitle.value = ''
  docBody.value = ''
}

async function deleteDocument () {
  const collectionsRef = collection(db, `${auth.currentUser?.uid}`, `${currentFolder.value}`, 'data')
  await deleteDoc(doc(collectionsRef, `${originalDocTitle}`))
  await fetchDocs()
  originalDocTitle = ''
  docTitle.value = ''
  docBody.value = ''
}

function trimHtmlBody (html: string) {
  return html.substring(0, 25)
}

const newDocDialog = ref(false)
const newDocTitle = ref('')
const newDocBody = ref('')

async function createDoc () {
  const collectionsRef = collection(db, `${auth.currentUser?.uid}`, `${currentFolder.value}`, 'data')
  await setDoc(doc(collectionsRef, `${newDocTitle.value}`), {
    body: newDocBody.value
  })
  await fetchDocs()
  newDocTitle.value = ''
  newDocBody.value = ''
}

</script>

<style>
  .document-card {
    transition: .3s all ease;
  }
  .document-card:hover {
    cursor: pointer;
    scale: 1.05;
  }
</style>
