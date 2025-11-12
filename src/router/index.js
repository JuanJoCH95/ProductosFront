import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: () => import('@/views/Login.vue') },
    { path: '/', name: 'dashboard', component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true },
      children: [
        { 
          path: '',
          name: 'menu-principal', 
          component: () => import('@/components/WelcomePanel.vue')
        },
        { 
          path: 'productos', 
          name: 'productos', 
          component: () => import('@/views/ProductosView.vue')
        },
        {
          path: 'usuarios',
          name: 'usuarios', 
          component: () => import('@/views/UsuariosView.vue') 
        }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    // Si la ruta requiere autenticación y el usuario NO está logueado, redirigir al login
    next({ name: 'login' });
  } else if (to.name === 'login' && authStore.isLoggedIn) {
    // Si el usuario ya está logueado y va a /login, redirigir al dashboard
    next({ name: 'dashboard' });
  } else {
    next();
  }
});

export default router;