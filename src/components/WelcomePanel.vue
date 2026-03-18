<template>
  <div class="welcome-container">
    <div class="welcome-card">
      <h2>¡Bienvenido al Sistema de Inventario!</h2>
      <p>Selecciona una opción del menú lateral para gestionar tus productos y usuarios.</p>
    </div>
  </div>
</template>

<script setup>
// Lógica simple, si la necesitas
</script>

<style scoped>
.welcome-container {
  padding: 40px 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.welcome-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  padding: 50px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  max-width: 600px;
  text-align: center;
  border-left: 5px solid #27ae60;
}

h2 {
  color: #2c3e50;
  font-size: 2em;
  margin: 0 0 20px 0;
  font-weight: 700;
}

p {
  color: #7f8c8d;
  font-size: 1.1em;
  margin: 0;
  line-height: 1.6;
}
</style>