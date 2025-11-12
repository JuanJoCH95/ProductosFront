<script setup>
  import { ref, onMounted } from 'vue';
  import api from '@/api/axios';
  import { useRouter } from 'vue-router'; // Necesario para redirigir en caso de 401

  const productos = ref([]);
  const loading = ref(true);
  const error = ref(null);
  const router = useRouter();

  const fetchProductos = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get('/productos/all'); 
      productos.value = response.data;
    } catch (err) {
      console.error("Error al cargar productos: ", err);
      error.value = 'Error al cargar los datos';

      if (err.response && err.response.status === 401) {
        error.value = 'Sesión expirada o no autorizada';
        router.push({ name: 'login' });
      }
    } finally {
      loading.value = false;
    }
  };

  // Se llama automáticamente cuando el componente se monta
  onMounted(fetchProductos);

  // Funciones placeholder para las acciones (se implementarán después)
  const handleEdit = (id) => {
      console.log('Editar producto ID:', id);
      // Lógica para navegar a la vista de edición con el ID
  };

  const handleDelete = (id) => {
      console.log('Eliminar producto ID:', id);
      // Lógica para abrir modal de confirmación y llamar al DELETE
  };

  // Dar formato a la moneda
  const formatCurrency = (value) => {
    if (typeof value !== 'number') return value;
    return value.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    });
};
</script>

<template>
  <div class="productos-container">
    <h2>Lista de productos</h2>
    
    <div v-if="loading" class="message">Cargando datos del inventario...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="productos.length === 0" class="message">No hay productos registrados en el inventario.</div>

    <div v-else class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="producto in productos" :key="producto.idProducto">
            <td>{{ producto.idProducto }}</td>
            <td>{{ producto.nombre }}</td>
            <td>{{ formatCurrency(producto.precio) }}</td>
            <td>{{ producto.cantidadDisponible }}</td>
            <td>
              <button @click="handleEdit(producto.id)" class="action-button edit">Editar</button>
              <button @click="handleDelete(producto.id)" class="action-button delete">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
  .productos-container {
      padding: 20px;
  }
  h2 {
      text-align: center;
      margin-bottom: 25px;
  }
  .table-wrapper {
      overflow-x: auto;
  }
  table {
      width: 100%;
      border-collapse: collapse;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  th, td {
      border: 1px solid #ddd;
      padding: 12px 15px;
      text-align: left;
  }
  th {
      background-color: #f2f2f2;
      font-weight: bold;
  }
  td:last-child {
      text-align: center;
      width: 150px; /* Ancho fijo para las acciones */
  }
  .action-button {
      padding: 6px 10px;
      margin: 0 4px;
      cursor: pointer;
      border: none;
      border-radius: 4px;
      font-size: 14px;
  }
  .edit {
      background-color: #007bff;
      color: white;
  }
  .delete {
      background-color: #dc3545;
      color: white;
  }
  .error-message {
      color: #dc3545;
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      padding: 10px;
      border-radius: 5px;
  }
</style>