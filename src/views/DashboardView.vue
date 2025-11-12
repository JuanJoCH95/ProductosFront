<script setup>
    import SidebarMenu from '@/components/SidebarMenu.vue';
</script>

<template>
  <div class="inventory-system-layout">
    <header class="system-header">
      <h1>Sistema de Inventario</h1>
    </header>
    
    <div class="main-content-area">
      <SidebarMenu class="sidebar-area" />
      <div class="router-view-area">
        <RouterView /> 
      </div>
    </div>
  </div>
</template>

<style scoped>
  .inventory-system-layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
  }
  .system-header {
      background-color: #333;
      color: white;
      padding: 15px 20px;
      text-align: center;
      border-bottom: 2px solid #ff9800;
  }
  .main-content-area {
      display: flex;
      flex-grow: 1;
  }
  .sidebar-area {
      width: 200px;
      background-color: #2c3e50;
      color: white;
  }
  .router-view-area {
      flex-grow: 1;
      padding: 20px;
  }
</style>