<template>
  <q-page class="row items-center justify-evenly">
    {{ route.params.folder_uid  }}
  </q-page>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

</script>
