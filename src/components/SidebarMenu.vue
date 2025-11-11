<script setup>
    import { useAuthStore } from '@/stores/auth';
    import { useRouter } from 'vue-router';

    const authStore = useAuthStore();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await authStore.logout();
            router.push({ name: 'login' });
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            router.push({ name: 'login' }); 
        }
    };
</script>

<template>
    <div class="sidebar">
        <RouterLink to="/consultar" class="menu-item">Consultar</RouterLink>
        <RouterLink to="/editar" class="menu-item">Editar</RouterLink>
        <RouterLink to="/eliminar" class="menu-item">Eliminar</RouterLink>

        <button @click="handleLogout" class="logout-button">Logout</button>
    </div>
</template>

<style scoped>
    .sidebar {
        width: 200px; /* Ancho fijo del menú */
        background-color: #2c3e50;
        color: white;
        padding-top: 20px;
        height: 100vh; /* Ocupa toda la altura */
    }
    .menu-item, .logout-button {
        display: block;
        padding: 15px;
        text-decoration: none;
        color: white;
        background: none;
        border: none;
        width: 100%;
        text-align: left;
        cursor: pointer;
    }
    .menu-item:hover, .logout-button:hover {
        background-color: #34495e;
    }
</style>