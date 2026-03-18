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

  const showDeleteConfirmModal = ref(false);
  const deleteConfirmError = ref(null);
  const productToDelete = ref(null);
  const isDeleting = ref(false);

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
      router.push({ name: 'producto-edit', params: { id } });
  };

  const handleDelete = (producto) => {
      productToDelete.value = producto;
      deleteConfirmError.value = null;
      showDeleteConfirmModal.value = true;
  };

  const confirmDelete = async () => {
      if (!productToDelete.value) return;
      
      isDeleting.value = true;
      deleteConfirmError.value = null;

      try {
          const response = await api.delete(`/productos/delete/${productToDelete.value.idProducto}`);

          if (response.data.codigo === 1) {
              showDeleteConfirmModal.value = false;
              productToDelete.value = null;
              fetchProductos();
          } else {
              deleteConfirmError.value = 'Error al eliminar el producto';
          }
      } catch (err) {
          console.error('Error al eliminar producto:', err);
          deleteConfirmError.value = 'Ocurrió un error inesperado al eliminar el producto';
      } finally {
          isDeleting.value = false;
      }
  };

  const cancelDelete = () => {
      showDeleteConfirmModal.value = false;
      productToDelete.value = null;
      deleteConfirmError.value = null;
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
              <button @click="handleEdit(producto.idProducto)" class="action-button edit-button">Editar</button>
              <button @click="handleDelete(producto)" class="action-button delete-button">Eliminar</button>
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

    <div v-if="showDeleteConfirmModal" class="modal-overlay">
      <div class="modal-card">
        <h3>Confirmar eliminación</h3>
        <div v-if="deleteConfirmError" class="error-message">{{ deleteConfirmError }}</div>
        <p v-if="productToDelete" class="confirm-message">
          ¿Estás seguro de que deseas eliminar el producto <strong>{{ productToDelete.nombre }}</strong>?
        </p>
        <div class="modal-actions">
          <button @click="confirmDelete" :disabled="isDeleting" class="accept-button">
            {{ isDeleting ? 'Eliminando...' : 'Confirmar' }}
          </button>
          <button @click="cancelDelete" :disabled="isDeleting" class="cancel-button">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .productos-container {
      padding: 30px;
      background-color: #f5f7fa;
      color: #2c3e50;
      min-height: 100vh;
  }

  h2 {
      text-align: left;
      margin-bottom: 30px;
      font-size: 2em;
      color: #2c3e50;
      font-weight: 600;
  }

  .message {
      text-align: center;
      color: #7f8c8d;
      font-size: 1.1em;
      margin-top: 20px;
      padding: 40px;
      background-color: #ffffff;
      border-radius: 8px;
      border-left: 4px solid #27ae60;
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

  .table-wrapper {
      overflow-x: auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  table {
      width: 100%;
      border-collapse: collapse;
      min-width: 600px;
  }

  th, td {
      padding: 16px 18px;
      text-align: left;
      border-bottom: 1px solid #eceff1;
  }

  th {
      background-color: #f8f9fa;
      color: #2c3e50;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.85em;
      letter-spacing: 0.5px;
  }

  tr:last-child td {
      border-bottom: none;
  }

  tbody tr {
      transition: background-color 0.2s ease;
  }

  tbody tr:hover {
      background-color: #f8f9fa;
  }

  .action-buttons-cell {
      text-align: center;
      white-space: nowrap;
      display: flex;
      gap: 8px;
      justify-content: center;
  }

  .action-button {
      padding: 8px 14px;
      border-radius: 6px;
      font-size: 0.85em;
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
      font-weight: 600;
  }

  .edit-button {
      background-color: #3498db;
      color: white;
  }

  .edit-button:hover {
      background-color: #2980b9;
      box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
  }

  .delete-button {
      background-color: #e74c3c;
      color: white;
  }

  .delete-button:hover {
      background-color: #c0392b;
      box-shadow: 0 4px 8px rgba(231, 76, 60, 0.3);
  }

  .confirm-message {
      text-align: center;
      color: #2c3e50;
      font-size: 1.05em;
      margin: 20px 0;
      line-height: 1.6;
  }

  .confirm-message strong {
      color: #e74c3c;
      font-weight: 600;
  }

  .header-with-button {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    flex-wrap: wrap;
    gap: 20px;
  }

  .new-product-button {
      background-color: #27ae60;
      color: white;
      padding: 12px 24px;
      border-radius: 6px;
      font-size: 1em;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      box-shadow: 0 2px 6px rgba(39, 174, 96, 0.2);
      transition: all 0.3s ease;
  }

  .new-product-button:hover {
      background-color: #229954;
      box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
  }

  .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      padding: 20px;
      overflow-y: auto;
  }

  .modal-card {
      background-color: #ffffff;
      padding: 35px;
      border-radius: 8px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      width: 100%;
      max-width: 500px;
      color: #2c3e50;
      max-height: 90vh;
      overflow-y: auto;
      margin: auto;
  }

  .modal-card h3 {
      margin-top: 0;
      margin-bottom: 25px;
      color: #2c3e50;
      font-size: 1.6em;
      text-align: center;
      font-weight: 600;
  }

  .form-group {
      margin-bottom: 22px;
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
      font-size: 1em;
      transition: all 0.3s ease;
  }

  .form-group input:focus {
      outline: none;
      border-color: #27ae60;
      box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.1);
  }

  .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 30px;
  }

  .accept-button {
      background-color: #27ae60;
      color: white;
      padding: 12px 24px;
      border-radius: 6px;
      font-size: 0.95em;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;
      font-weight: 600;
  }

  .accept-button:hover:not(:disabled) {
      background-color: #229954;
      box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
  }

  .cancel-button {
      background-color: #95a5a6;
      color: white;
      padding: 12px 24px;
      border-radius: 6px;
      font-size: 0.95em;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;
      font-weight: 600;
  }

  .cancel-button:hover:not(:disabled) {
      background-color: #7f8c8d;
      box-shadow: 0 4px 12px rgba(149, 165, 166, 0.3);
  }
</style>