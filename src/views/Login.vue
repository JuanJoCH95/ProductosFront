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
      background: linear-gradient(135deg, #f5f7fa 0%, #eceff1 100%);
      padding: 20px;
  }

  .login-card {
      background-color: #ffffff;
      padding: 50px;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 420px;
      text-align: center;
  }

  h2 {
      color: #2c3e50;
      margin-bottom: 35px;
      font-size: 2.2em;
      font-weight: 700;
      letter-spacing: -0.5px;
  }

  .form-group {
      margin-bottom: 24px;
      text-align: left;
  }

  label {
      display: block;
      margin-bottom: 8px;
      color: #2c3e50;
      font-weight: 600;
      font-size: 0.95em;
  }

  input {
      width: 100%;
      padding: 12px 14px;
      border: 1px solid #e0e6ed;
      border-radius: 6px;
      background-color: #ffffff;
      color: #2c3e50;
      font-size: 1em;
      transition: all 0.3s ease;
      box-sizing: border-box;
  }

  input:focus {
      outline: none;
      border-color: #27ae60;
      box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.1);
  }

  .login-button {
      width: 100%;
      padding: 14px;
      background-color: #27ae60;
      color: white;
      border-radius: 6px;
      font-size: 1em;
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
      font-weight: 600;
      letter-spacing: 0.5px;
      box-shadow: 0 4px 12px rgba(39, 174, 96, 0.2);
  }

  .login-button:hover {
      background-color: #229954;
      box-shadow: 0 6px 16px rgba(39, 174, 96, 0.3);
  }
  
  .error-message {
      color: #c0392b;
      background-color: #fadbd8;
      border: 1px solid #e74c3c;
      border-left: 4px solid #c0392b;
      padding: 14px;
      border-radius: 6px;
      margin-bottom: 25px;
      font-weight: 500;
      text-align: left;
  }
</style>