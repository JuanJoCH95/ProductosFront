<script setup>
  import { ref, onMounted, reactive } from 'vue';
  import api from '@/api/axios';
  import { useRouter } from 'vue-router';

  const productos = ref([]);
  const error = ref(null);
  const router = useRouter();

  const showNewProductModal = ref(false);
  const newProduct = reactive({ nombre: '', precio: 0, cantidadDisponible: 0,});
  const newProductError = ref(null);
  const newProductSuccessMessage = ref(null);

  const fetchProductos = async () => {
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

  const openNewProductModal = () => {
    newProduct.nombre = '';
    newProduct.precio = 0;
    newProduct.cantidadDisponible = 0;
    newProductError.value = null;
    newProductSuccessMessage.value = null;
    showNewProductModal.value = true;
  };

  const closeNewProductModal = () => {
    showNewProductModal.value = false;
  };

  const createNewProduct = async () => {
    newProductError.value = null;
    newProductSuccessMessage.value = null;

    try {
        const response = await api.post('/productos/new', newProduct);

        if (response.data.codigo === 1) {
          newProductSuccessMessage.value = 'Producto agregado exitosamente';
        } else {
          newProductError.value = 'Error al agregar el producto, datos incompletos o inválidos';
        }
        
        fetchProductos();
        setTimeout(() => {
            closeNewProductModal();
        }, 2000);
    } catch (err) {
        console.error("Error al crear producto:", err);
        newProductError.value = 'Ocurrio un error inesperado al agregar el producto';
    }
  };

  onMounted(fetchProductos);

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
    <div class="header-with-button">
      <h2>Lista de productos</h2>
      <button @click="openNewProductModal" class="new-product-button">Nuevo Producto</button>
    </div>

    <div v-if="error" class="error-message">{{ error }}</div>
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
            <td class="action-buttons-cell">
              <button @click="handleEdit(producto.id)" class="action-button edit-button">Editar</button>
              <button @click="handleDelete(producto.id)" class="action-button delete-button">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showNewProductModal" class="modal-overlay">
      <div class="modal-card">
        <h3>Agregar Nuevo Producto</h3>
        <div v-if="newProductError" class="error-message">{{ newProductError }}</div>
        <div v-if="newProductSuccessMessage" class="success-message">{{ newProductSuccessMessage }}</div>

        <form @submit.prevent="createNewProduct">
          <div class="form-group">
            <label for="new-nombre">Nombre:</label>
            <input id="new-nombre" type="text" v-model="newProduct.nombre" required />
          </div>
          <div class="form-group">
            <label for="new-precio">Precio:</label>
            <input id="new-precio" type="number" v-model="newProduct.precio" required min="0" />
          </div>
          <div class="form-group">
            <label for="new-cantidad">Cantidad:</label>
            <input id="new-cantidad" type="number" v-model="newProduct.cantidadDisponible" required min="0" />
          </div>
          <div class="modal-actions">
            <button type="submit" class="accept-button">Aceptar</button>
            <button type="button" @click="closeNewProductModal" class="cancel-button">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .productos-container {
      padding: 20px;
      background-color: #1a1a2e;
      color: #bbe1fa;
  }

  h2 {
      text-align: center;
      margin-bottom: 30px;
      font-size: 2.2em;
      color: #bbe1fa;
  }

  .message {
      text-align: center;
      color: #3282b8;
      font-size: 1.1em;
      margin-top: 20px;
  }

  .error-message {
      color: #ff4c4c;
      background-color: rgba(255, 76, 76, 0.2);
      border: 1px solid #ff4c4c;
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 20px;
      text-align: center;
  }

  .table-wrapper {
      overflow-x: auto;
      background-color: #2c3e50;
      border-radius: 8px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }

  table {
      width: 100%;
      border-collapse: collapse;
      min-width: 600px;
  }

  th, td {
      padding: 15px 20px;
      text-align: left;
      border-bottom: 1px solid #3282b8;
  }

  th {
      background-color: #0f4c75;
      color: white;
      font-weight: bold;
      text-transform: uppercase;
      font-size: 0.9em;
  }

  tr:last-child td {
      border-bottom: none;
  }

  tbody tr:hover {
      background-color: #3282b840;
  }

  .action-buttons-cell {
      text-align: center;
      white-space: nowrap;
  }

  .action-button {
      padding: 8px 15px;
      margin: 0 5px;
      border-radius: 5px;
      font-size: 0.9em;
      transition: background-color 0.3s ease;
  }

  .edit-button {
      background-color: #3282b8;
      color: white;
  }

  .edit-button:hover {
      background-color: #0f4c75;
  }

  .delete-button {
      background-color: #ff4c4c;
      color: white;
  }

  .delete-button:hover {
      background-color: #cc3333;
  }

  .header-with-button {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }

  .new-product-button {
      background-color: #4CAF50;
      color: white;
      padding: 10px 15px;
      border-radius: 5px;
      font-size: 1em;
      display: flex;
      align-items: center;
      gap: 5px;
  }

  .new-product-button:hover {
      background-color: #45a049;
  }

  .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.6);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
  }

  .modal-card {
      background-color: #2c3e50;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
      width: 100%;
      max-width: 450px;
      color: #bbe1fa;
  }

  .modal-card h3 {
      margin-top: 0;
      margin-bottom: 25px;
      color: #bbe1fa;
      font-size: 1.8em;
      text-align: center;
  }

  .form-group {
      margin-bottom: 20px;
  }

  .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: bold;
      color: #bbe1fa;
  }

  .form-group input {
      width: 100%;
      padding: 10px;
      border: 1px solid #3282b8;
      border-radius: 5px;
      background-color: #1a1a2e;
      color: #bbe1fa;
  }

  .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 15px;
      margin-top: 30px;
  }

  .accept-button {
      background-color: #4CAF50;
  }

  .accept-button:hover {
      background-color: #45a049;
  }

  .cancel-button {
      background-color: #ff4c4c;
  }

  .cancel-button:hover {
      background-color: #cc3333;
  }

  .success-message {
      color: #4CAF50;
      background-color: rgba(76, 175, 80, 0.2);
      border: 1px solid #4CAF50;
      padding: 10px;
      border-radius: 5px;
      margin-bottom: 20px;
      text-align: center;
  }
</style>