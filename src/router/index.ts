import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Layout',
    redirect: '/home',
    component: () => import('../layout/index.vue'),
    children: [
      {
        path: '/',
        component: () => import('../views/Home.vue')
      },
      {
        path: 'home',
        component: () => import('../views/Home.vue')
      },
      {
        path: 'user',
        component: () => import('../views/User.vue')
      },
      {
        path: 'tags',
        component: () => import('../views/Tags.vue')
      },
      {
        path: 'personal',
        component: () => import('../views/Personal.vue')
      },
      {
        path: 'proposal',
        component: () => import('../views/Proposal.vue')
      },
      {
        path: 'token',
        component: () => import('../views/Token.vue')
      },
      {
        path: 'submit',
        component: () => import('../views/Submit.vue')
      },
      {
        path: 'detail/:id',
        component: () => import('../views/Detail.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/:catchAll(.*)',
    name: '/404',
    component: () => import('../views/404.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
