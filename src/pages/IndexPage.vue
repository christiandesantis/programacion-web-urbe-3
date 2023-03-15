<template>
  <q-page class="q-pa-md bg-yellow-10">
    <div class="row text-center">
      <div class="q-ml-auto q-mr-auto">
        <q-icon name="lightbulb" color="white" size="20em" />
      </div>
    </div>
    <div class="row text-center text-white">
      <div class="col-12">
        <h3 class="q-mb-sm">Tarea 3 Programación Web</h3>
      </div>
      <div class="col-12">
        <h5 class="q-ma-none">Aplciación de Bloc de notas</h5>
      </div>
      <div class="col-12 q-mt-xl">
        <q-btn to="/login" outline size="lg" flat label="Login" />
        <q-btn to="/register" outline size="lg" flat label="Register" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'

</script>
