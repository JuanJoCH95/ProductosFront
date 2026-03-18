<script setup>
  import { ref, onMounted, reactive } from 'vue';
  import api from '@/api/axios';
  import { useRouter } from 'vue-router';

  const usuarios = ref([]);
  const error = ref(null);
  const loading = ref(false);
  const router = useRouter();

  const showNewUsuarioModal = ref(false);
  const newUsuario = reactive({ 
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
  const newUsuarioError = ref(null);
  const newUsuarioSuccessMessage = ref(null);

  const showDeleteConfirmModal = ref(false);
  const deleteConfirmError = ref(null);
  const usuarioToDelete = ref(null);
  const isDeleting = ref(false);

  const fetchUsuarios = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.get('/usuarios/all');
      usuarios.value = response.data;
    } catch (err) {
      console.error("Error al cargar usuarios: ", err);
      error.value = 'Error al cargar los datos';

      if (err.response && err.response.status === 401) {
        error.value = 'Sesión expirada o no autorizada';
        router.push({ name: 'login' });
      }
    } finally {
      loading.value = false;
    }
  };

  const openNewUsuarioModal = () => {
    newUsuario.tipoDocumentoIdentidad = '';
    newUsuario.numDocumentoIdentidad = '';
    newUsuario.nombres = '';
    newUsuario.apellidos = '';
    newUsuario.telefono = '';
    newUsuario.direccion = '';
    newUsuario.email = '';
    newUsuario.usuario = '';
    newUsuario.clave = '';
    newUsuarioError.value = null;
    newUsuarioSuccessMessage.value = null;
    showNewUsuarioModal.value = true;
  };

  const closeNewUsuarioModal = () => {
    showNewUsuarioModal.value = false;
  };

  const createNewUsuario = async () => {
    newUsuarioError.value = null;
    newUsuarioSuccessMessage.value = null;

    try {
        const response = await api.post('/usuarios/new', newUsuario);

        if (response.data.codigo === 1) {
          newUsuarioSuccessMessage.value = 'Usuario agregado exitosamente';
        } else {
          newUsuarioError.value = 'Error al agregar el usuario, datos incompletos o inválidos';
        }
        
        fetchUsuarios();
        setTimeout(() => {
            closeNewUsuarioModal();
        }, 2000);
    } catch (err) {
        console.error("Error al crear usuario:", err);
        newUsuarioError.value = 'Ocurrio un error inesperado al agregar el usuario';
    }
  };

  onMounted(fetchUsuarios);

  const handleEdit = (id) => {
      router.push({ name: 'usuario-edit', params: { id } });
  };

  const handleDelete = (usuario) => {
      usuarioToDelete.value = usuario;
      deleteConfirmError.value = null;
      showDeleteConfirmModal.value = true;
  };

  const confirmDelete = async () => {
      if (!usuarioToDelete.value) return;
      
      isDeleting.value = true;
      deleteConfirmError.value = null;

      try {
          const response = await api.delete(`/usuarios/delete/${usuarioToDelete.value.idUsuario}`);

          if (response.data.codigo === 1) {
              showDeleteConfirmModal.value = false;
              usuarioToDelete.value = null;
              fetchUsuarios();
          } else {
              deleteConfirmError.value = 'Error al eliminar el usuario';
          }
      } catch (err) {
          console.error('Error al eliminar usuario:', err);
          deleteConfirmError.value = 'Ocurrió un error inesperado al eliminar el usuario';
      } finally {
          isDeleting.value = false;
      }
  };

  const cancelDelete = () => {
      showDeleteConfirmModal.value = false;
      usuarioToDelete.value = null;
      deleteConfirmError.value = null;
  };
</script>

<template>
  <div class="usuarios-container">
    <div class="header-with-button">
      <h2>Lista de usuarios</h2>
      <button @click="openNewUsuarioModal" class="new-usuario-button">Nuevo Usuario</button>
    </div>

    <div v-if="loading" class="loading-message">Cargando usuarios...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="usuarios.length === 0" class="message">No hay usuarios registrados en el sistema.</div>

    <div v-else class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Tipo Doc.</th>
            <th>Num. Documento</th>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>Email</th>
            <th>Usuario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="usuario in usuarios" :key="usuario.idUsuario">
            <td>{{ usuario.tipoDocumentoIdentidad }}</td>
            <td>{{ usuario.numDocumentoIdentidad }}</td>
            <td>{{ usuario.nombres }}</td>
            <td>{{ usuario.apellidos }}</td>
            <td>{{ usuario.email }}</td>
            <td>{{ usuario.usuario }}</td>
            <td class="action-buttons-cell">
              <button @click="handleEdit(usuario.idUsuario)" class="action-button edit-button">Editar</button>
              <button @click="handleDelete(usuario)" class="action-button delete-button">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showNewUsuarioModal" class="modal-overlay">
      <div class="modal-card">
        <h3>Agregar Nuevo Usuario</h3>
        <div v-if="newUsuarioError" class="error-message">{{ newUsuarioError }}</div>
        <div v-if="newUsuarioSuccessMessage" class="success-message">{{ newUsuarioSuccessMessage }}</div>

        <form @submit.prevent="createNewUsuario">
          <div class="form-group">
            <label for="new-tipoDocumento">Tipo de Documento:</label>
            <input id="new-tipoDocumento" type="text" v-model="newUsuario.tipoDocumentoIdentidad" required />
          </div>
          <div class="form-group">
            <label for="new-numDocumento">Número de Documento:</label>
            <input id="new-numDocumento" type="text" v-model="newUsuario.numDocumentoIdentidad" required />
          </div>
          <div class="form-group">
            <label for="new-nombres">Nombres:</label>
            <input id="new-nombres" type="text" v-model="newUsuario.nombres" required />
          </div>
          <div class="form-group">
            <label for="new-apellidos">Apellidos:</label>
            <input id="new-apellidos" type="text" v-model="newUsuario.apellidos" required />
          </div>
          <div class="form-group">
            <label for="new-telefono">Teléfono:</label>
            <input id="new-telefono" type="text" v-model="newUsuario.telefono" required />
          </div>
          <div class="form-group">
            <label for="new-direccion">Dirección:</label>
            <input id="new-direccion" type="text" v-model="newUsuario.direccion" required />
          </div>
          <div class="form-group">
            <label for="new-email">Email:</label>
            <input id="new-email" type="email" v-model="newUsuario.email" required />
          </div>
          <div class="form-group">
            <label for="new-usuario">Usuario:</label>
            <input id="new-usuario" type="text" v-model="newUsuario.usuario" required />
          </div>
          <div class="form-group">
            <label for="new-clave">Contraseña:</label>
            <input id="new-clave" type="password" v-model="newUsuario.clave" required />
          </div>
          <div class="modal-actions">
            <button type="submit" class="accept-button">Aceptar</button>
            <button type="button" @click="closeNewUsuarioModal" class="cancel-button">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showDeleteConfirmModal" class="modal-overlay">
      <div class="modal-card">
        <h3>Confirmar eliminación</h3>
        <div v-if="deleteConfirmError" class="error-message">{{ deleteConfirmError }}</div>
        <p v-if="usuarioToDelete" class="confirm-message">
          ¿Estás seguro de que deseas eliminar el usuario <strong>{{ usuarioToDelete.nombres }} {{ usuarioToDelete.apellidos }}</strong>?
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
  .usuarios-container {
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

  .loading-message {
      text-align: center;
      color: #3498db;
      font-size: 1.1em;
      margin-top: 20px;
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

  .new-usuario-button {
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

  .new-usuario-button:hover {
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