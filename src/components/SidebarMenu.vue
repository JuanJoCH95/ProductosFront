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
        <RouterLink to="/productos" class="menu-item">Productos</RouterLink>
        <RouterLink to="/usuarios" class="menu-item">Usuarios</RouterLink>
        
        <button @click="handleLogout" class="logout-button">Logout</button>
    </div>
</template>

<style scoped>
    .sidebar {
        width: 200px;
        background-color: #2c3e50;
        padding-top: 25px;
        box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
        display: flex;
        flex-direction: column;
        height: 100%;
        gap: 10px;
    }

    .menu-item, .logout-button {
        display: block;
        padding: 15px 20px;
        text-decoration: none;
        color: #bbe1fa;
        font-weight: 500;
        transition: background-color 0.3s ease, color 0.3s ease;
        border-left: 5px solid transparent;
        background: none;
        text-align: left;
        cursor: pointer;
        font-size: 1.05em;
    }

    .menu-item:hover, .logout-button:hover {
        background-color: #0f4c75;
        border-left-color: #3282b8;
    }

    .router-link-active {
        background-color: #0f4c75;
        border-left-color: #3282b8;
        color: white;
    }

    .logout-button {
        margin-top: auto;
        border-top: 1px solid #3282b8;
        padding-top: 20px;
        padding-bottom: 20px;
    }
</style>