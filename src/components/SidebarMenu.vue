<script setup>
    import { useAuthStore } from '@/stores/auth';
    import { useRouter } from 'vue-router';

    const authStore = useAuthStore();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await authStore.logout();
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        } finally {
            // Redirige al login sin importar si falla o no
            router.push({ name: 'login' });
        }
    };
</script>

<template>
    <div class="sidebar">
        <RouterLink to="/productos" class="menu-item">Productos</RouterLink>
        <RouterLink to="/usuarios" class="menu-item">Usuarios</RouterLink>
        
        <button @click="handleLogout" class="logout-button">Salir</button>
    </div>
</template>

<style scoped>
    .sidebar {
        width: 250px;
        background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
        padding-top: 30px;
        box-shadow: 2px 0 12px rgba(0, 0, 0, 0.15);
        display: flex;
        flex-direction: column;
        height: 100%;
        gap: 5px;
    }

    .menu-item, .logout-button {
        display: block;
        padding: 14px 24px;
        text-decoration: none;
        color: #ecf0f1;
        font-weight: 500;
        transition: all 0.3s ease;
        border-left: 4px solid transparent;
        background: none;
        text-align: left;
        cursor: pointer;
        font-size: 1em;
        border: none;
    }

    .menu-item:hover, .logout-button:hover {
        background-color: rgba(39, 174, 96, 0.2);
        border-left-color: #27ae60;
        color: #27ae60;
    }

    .router-link-active {
        background-color: rgba(39, 174, 96, 0.3);
        border-left-color: #27ae60;
        color: #27ae60;
        font-weight: 600;
    }

    .logout-button {
        margin-top: auto;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding-top: 20px;
        padding-bottom: 20px;
        background-color: rgba(39, 174, 96, 0.15);
        border-left-color: #27ae60;
        color: #27ae60;
        font-weight: 600;
        transition: all 0.3s ease;
    }

    .logout-button:hover {
        background-color: rgba(39, 174, 96, 0.25);
        color: #27ae60;
    }
</style>