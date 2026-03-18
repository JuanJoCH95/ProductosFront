<script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import api from '@/api/axios';

  const router = useRouter();
  const route = useRoute();
  const loading = ref(true);
  const error = ref(null);
  const successMessage = ref(null);
  
  const producto = ref({
    idProducto: null,
    nombre: '',
    precio: 0,
    cantidadDisponible: 0
  });

  const fetchProducto = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const id = route.params.id;
      const response = await api.get(`/productos/find/${id}`);
      producto.value = response.data;
    } catch (err) {
      console.error('Error al cargar el producto:', err);
      error.value = 'Error al cargar el producto';
      
      if (err.response && err.response.status === 401) {
        router.push({ name: 'login' });
      }
    } finally {
      loading.value = false;
    }
  };

  const updateProducto = async () => {
    error.value = null;
    successMessage.value = null;

    if (!producto.value.nombre || producto.value.precio < 0 || producto.value.cantidadDisponible < 0) {
      error.value = 'Por favor completa todos los campos correctamente';
      return;
    }

    try {
      const response = await api.post(`/productos/edit`, producto.value);

      if (response.data.codigo === 1) {
        successMessage.value = 'Producto actualizado exitosamente';
        setTimeout(() => {
          router.push({ name: 'productos' });
        }, 1500);
      } else {
        error.value = 'Error al actualizar el producto';
      }
    } catch (err) {
      console.error('Error al actualizar producto:', err);
      error.value = 'Ocurrió un error inesperado al actualizar el producto';
    }
  };

  const cancelEdit = () => {
    router.push({ name: 'productos' });
  };

  onMounted(fetchProducto);
</script>

<template>
  <div class="edit-container">
    <div class="header">
      <h2>Editar Producto</h2>
    </div>

    <div v-if="loading" class="loading-message">Cargando producto...</div>

    <div v-else-if="error" class="error-message">{{ error }}</div>

    <div v-else class="form-wrapper">
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

      <form @submit.prevent="updateProducto">
        <div class="form-group">
          <label for="edit-id">ID del Producto:</label>
          <input id="edit-id" type="text" :value="producto.idProducto" disabled />
        </div>

        <div class="form-group">
          <label for="edit-nombre">Nombre:</label>
          <input 
            id="edit-nombre" 
            type="text" 
            v-model="producto.nombre" 
            required 
            placeholder="Ingresa el nombre del producto"
          />
        </div>

        <div class="form-group">
          <label for="edit-precio">Precio:</label>
          <input 
            id="edit-precio" 
            type="number" 
            v-model="producto.precio" 
            required 
            min="0" 
            step="0.01"
            placeholder="Ingresa el precio"
          />
        </div>

        <div class="form-group">
          <label for="edit-cantidad">Cantidad Disponible:</label>
          <input 
            id="edit-cantidad" 
            type="number" 
            v-model="producto.cantidadDisponible" 
            required 
            min="0"
            placeholder="Ingresa la cantidad"
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
