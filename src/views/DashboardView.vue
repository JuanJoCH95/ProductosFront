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
      height: 100%;
      width: 100%;
  }

  .system-header {
      background-color: #0f4c75;
      color: #bbe1fa;
      padding: 15px 20px;
      text-align: center;
      font-size: 1.8em;
      font-weight: bold;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
      z-index: 10;
  }

  .main-content-area {
      display: flex;
      flex-grow: 1;
      width: 100%;
  }
  
  .router-view-area {
      flex-grow: 1;
      padding: 25px;
      background-color: #1a1a2e;
      overflow-y: auto;
  }
</style>