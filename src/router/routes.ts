import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/GuestLayout.vue'),
    children: [
      { path: '', name: 'index', component: () => import('pages/IndexPage.vue') },
      { path: 'register', name: 'register', component: () => import('pages/RegisterPage.vue') },
      { path: 'login', name: 'login', component: () => import('pages/LoginPage.vue') }
    ]
  },
  {
    path: '/notas/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'notes', component: () => import('pages/NotesPage.vue') },
      { path: ':folder_uid', name: 'folder', component: () => import('pages/FolderPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
