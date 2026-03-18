import { defineStore } from 'pinia';
import api from '@/api/axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: false,
        user: null
    }),
    actions: {
        async login(username, password) {
            try {
                const response = await api.post('/auth/login', { username, password });
                
                // Si la petición es exitosa (200 OK):
                this.isLoggedIn = true;
                this.user = { username };
                return response.data;

            } catch (error) {
                // Manejo de error 401 Unauthorized de Spring
                this.isLoggedIn = false;
                throw error;
            }
        },
        async logout() {
            try {
                // Llama al endpoint de logout
                await api.post('/auth/logout');
            } catch (error) {
                console.error('Error al hacer logout en el backend:', error);
            } finally {
                // Limpia el estado local sin importar si el backend falla
                this.isLoggedIn = false;
                this.user = null;
                localStorage.removeItem('user');
            }
        }
    }
});