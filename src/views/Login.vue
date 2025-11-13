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
  <div class="login-wrapper">
    <div class="login-card">
      <h2>Iniciar Sesión</h2>
      
      <div v-if="error" class="error-message">{{ error }}</div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Usuario</label>
          <input id="username" type="text" v-model="username" required autocomplete="username" />
        </div>
        
        <div class="form-group">
          <label for="password">Contraseña</label>
          <input id="password" type="password" v-model="password" required autocomplete="current-password" />
        </div>
        
        <button type="submit" class="login-button">Entrar</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
  .login-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #1a1a2e;
  }

  .login-card {
      background-color: #2c3e50;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
      width: 100%;
      max-width: 400px;
      text-align: center;
  }

  h2 {
      color: #bbe1fa;
      margin-bottom: 30px;
      font-size: 2em;
  }

  .form-group {
      margin-bottom: 20px;
      text-align: left;
  }

  label {
      display: block;
      margin-bottom: 8px;
      color: #bbe1fa;
      font-weight: bold;
  }

  input {
      width: 100%;
      padding: 10px;
      border: 1px solid #3282b8;
      border-radius: 5px;
      background-color: #1a1a2e; /* Input más oscuro */
      color: #bbe1fa;
  }

  input:focus {
      outline: none;
      border-color: #0f4c75;
      box-shadow: 0 0 0 2px rgba(15, 76, 117, 0.5);
  }

  .login-button {
      width: 100%;
      padding: 12px;
      background-color: #0f4c75;
      color: white;
      border-radius: 5px;
      font-size: 1.1em;
      transition: background-color 0.3s ease;
  }

  .login-button:hover {
      background-color: #3282b8;
  }
  
  .error-message {
      color: #ff4c4c;
      background-color: rgba(255, 76, 76, 0.2);
      border: 1px solid #ff4c4c;
      padding: 10px;
      border-radius: 5px;
      margin-bottom: 20px;
  }
</style>