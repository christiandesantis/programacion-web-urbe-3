import { boot } from 'quasar/wrappers'
import { app } from '../composables/firebase'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async (/* { app, router, ... } */) => {
  const appInitialized = app
})
