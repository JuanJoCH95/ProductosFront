<script setup>
    import { ref } from 'vue';
    import { useAuthStore } from '@/stores/auth';
    import { useRouter } from 'vue-router';

    const authStore = useAuthStore();
    const router = useRouter();

    const username = ref('');
    const password = ref('');
    const error = ref(null);

    const handleLogin = async () => {
        error.value = null;
        try {
            await authStore.login(username.value, password.value);
            router.push({ name: 'dashboard' });

        } catch (err) {
            error.value = 'Credenciales inválidas. Por favor, inténtalo de nuevo.';
        }
    };
</script>

<template>
  <form @submit.prevent="handleLogin">
    <h2>Iniciar Sesión</h2>
    <div v-if="error" style="color: red;">{{ error }}</div>
    
    <input type="text" v-model="username" placeholder="Usuario" required />
    <input type="password" v-model="password" placeholder="Contraseña" required />
    
    <button type="submit">Entrar</button>
  </form>
</template>