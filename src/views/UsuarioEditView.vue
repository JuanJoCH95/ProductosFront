<script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import api from '@/api/axios';

  const router = useRouter();
  const route = useRoute();
  const loading = ref(true);
  const error = ref(null);
  const successMessage = ref(null);
  
  const usuario = ref({
    idUsuario: null,
    tipoDocumentoIdentidad: '',
    numDocumentoIdentidad: '',
    nombres: '',
    apellidos: '',
    telefono: '',
    direccion: '',
    email: '',
    usuario: '',
    clave: ''
  });

  const fetchUsuario = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const id = route.params.id;
      const response = await api.get(`/usuarios/find/${id}`);
      usuario.value = response.data;
    } catch (err) {
      console.error('Error al cargar el usuario:', err);
      error.value = 'Error al cargar el usuario';
      
      if (err.response && err.response.status === 401) {
        router.push({ name: 'login' });
      }
    } finally {
      loading.value = false;
    }
  };

  const updateUsuario = async () => {
    error.value = null;
    successMessage.value = null;

    if (!usuario.value.tipoDocumentoIdentidad || !usuario.value.numDocumentoIdentidad || !usuario.value.nombres || !usuario.value.apellidos || !usuario.value.email || !usuario.value.usuario) {
      error.value = 'Por favor completa todos los campos obligatorios';
      return;
    }

    try {
      const response = await api.post(`/usuarios/edit`, usuario.value);

      if (response.data.codigo === 1) {
        successMessage.value = 'Usuario actualizado exitosamente';
        setTimeout(() => {
          router.push({ name: 'usuarios' });
        }, 1500);
      } else {
        error.value = 'Error al actualizar el usuario';
      }
    } catch (err) {
      console.error('Error al actualizar usuario:', err);
      error.value = 'Ocurrió un error inesperado al actualizar el usuario';
    }
  };

  const cancelEdit = () => {
    router.push({ name: 'usuarios' });
  };

  onMounted(fetchUsuario);
</script>

<template>
  <div class="edit-container">
    <div class="header">
      <h2>Editar Usuario</h2>
    </div>

    <div v-if="loading" class="loading-message">Cargando usuario...</div>

    <div v-else-if="error" class="error-message">{{ error }}</div>

    <div v-else class="form-wrapper">
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

      <form @submit.prevent="updateUsuario">
        <div class="form-group">
          <label for="edit-id">ID del Usuario:</label>
          <input id="edit-id" type="text" :value="usuario.idUsuario" disabled />
        </div>

        <div class="form-group">
          <label for="edit-tipoDocumento">Tipo de Documento:</label>
          <input 
            id="edit-tipoDocumento" 
            type="text" 
            v-model="usuario.tipoDocumentoIdentidad" 
            required 
            placeholder="Ej: CC, CI, TI, etc"
          />
        </div>

        <div class="form-group">
          <label for="edit-numDocumento">Número de Documento:</label>
          <input 
            id="edit-numDocumento" 
            type="text" 
            v-model="usuario.numDocumentoIdentidad" 
            required 
            placeholder="Ingresa el número de documento"
          />
        </div>

        <div class="form-group">
          <label for="edit-nombres">Nombres:</label>
          <input 
            id="edit-nombres" 
            type="text" 
            v-model="usuario.nombres" 
            required 
            placeholder="Ingresa los nombres"
          />
        </div>

        <div class="form-group">
          <label for="edit-apellidos">Apellidos:</label>
          <input 
            id="edit-apellidos" 
            type="text" 
            v-model="usuario.apellidos" 
            required 
            placeholder="Ingresa los apellidos"
          />
        </div>

        <div class="form-group">
          <label for="edit-telefono">Teléfono:</label>
          <input 
            id="edit-telefono" 
            type="text" 
            v-model="usuario.telefono" 
            placeholder="Ingresa el teléfono"
          />
        </div>

        <div class="form-group">
          <label for="edit-direccion">Dirección:</label>
          <input 
            id="edit-direccion" 
            type="text" 
            v-model="usuario.direccion" 
            placeholder="Ingresa la dirección"
          />
        </div>

        <div class="form-group">
          <label for="edit-email">Email:</label>
          <input 
            id="edit-email" 
            type="email" 
            v-model="usuario.email" 
            required 
            placeholder="Ingresa el email"
          />
        </div>

        <div class="form-group">
          <label for="edit-usuario">Usuario:</label>
          <input 
            id="edit-usuario" 
            type="text" 
            v-model="usuario.usuario" 
            required 
            placeholder="Ingresa el usuario"
          />
        </div>

        <div class="form-group">
          <label for="edit-clave">Contraseña:</label>
          <input 
            id="edit-clave" 
            type="password" 
            v-model="usuario.clave" 
            placeholder="Ingresa la contraseña (dejar vacío si no quieres cambiarla)"
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="save-button">Guardar Cambios</button>
          <button type="button" @click="cancelEdit" class="cancel-button">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
  .edit-container {
    padding: 30px;
    background-color: #f5f7fa;
    color: #2c3e50;
    min-height: 100vh;
  }

  .header {
    margin-bottom: 35px;
  }

  h2 {
    text-align: left;
    font-size: 2em;
    color: #2c3e50;
    margin: 0;
    font-weight: 600;
  }

  .loading-message {
    text-align: center;
    color: #7f8c8d;
    font-size: 1.1em;
    margin-top: 40px;
    padding: 40px;
    background-color: #ffffff;
    border-radius: 8px;
    border-left: 4px solid #3498db;
  }

  .error-message {
    color: #c0392b;
    background-color: #fadbd8;
    border: 1px solid #e74c3c;
    border-left: 4px solid #c0392b;
    padding: 14px;
    border-radius: 6px;
    margin-bottom: 20px;
    text-align: left;
    font-weight: 500;
  }

  .success-message {
    color: #27ae60;
    background-color: #d5f4e6;
    border: 1px solid #27ae60;
    border-left: 4px solid #229954;
    padding: 14px;
    border-radius: 6px;
    margin-bottom: 20px;
    text-align: left;
    font-weight: 500;
  }

  .form-wrapper {
    background-color: #ffffff;
    padding: 35px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: 0 auto;
  }

  .form-group {
    margin-bottom: 24px;
  }

  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #2c3e50;
    font-size: 0.95em;
  }

  .form-group input {
    width: 100%;
    padding: 12px;
    border: 1px solid #e0e6ed;
    border-radius: 6px;
    background-color: #ffffff;
    color: #2c3e50;
    box-sizing: border-box;
    font-size: 1em;
    transition: all 0.3s ease;
  }

  .form-group input:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    background-color: #f8f9fa;
  }

  .form-group input:focus {
    outline: none;
    border-color: #27ae60;
    box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.1);
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 35px;
    padding-top: 25px;
    border-top: 1px solid #eceff1;
  }

  .save-button {
    background-color: #27ae60;
    color: white;
    padding: 12px 28px;
    border-radius: 6px;
    font-size: 0.95em;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    font-weight: 600;
    box-shadow: 0 2px 6px rgba(39, 174, 96, 0.2);
  }

  .save-button:hover {
    background-color: #229954;
    box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
  }

  .cancel-button {
    background-color: #95a5a6;
    color: white;
    padding: 12px 28px;
    border-radius: 6px;
    font-size: 0.95em;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    font-weight: 600;
    box-shadow: 0 2px 6px rgba(149, 165, 166, 0.2);
  }

  .cancel-button:hover {
    background-color: #7f8c8d;
    box-shadow: 0 4px 12px rgba(149, 165, 166, 0.3);
  }
</style>
