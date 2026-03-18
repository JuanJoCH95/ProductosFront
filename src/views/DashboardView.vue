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
      background-color: #f5f7fa;
  }

  .system-header {
      background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
      color: white;
      padding: 18px 30px;
      text-align: left;
      font-size: 1.6em;
      font-weight: 700;
      letter-spacing: -0.5px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10;
  }

  .system-header h1 {
      margin: 0;
      display: flex;
      align-items: center;
      gap: 10px;
  }

  .main-content-area {
      display: flex;
      flex-grow: 1;
      width: 100%;
  }
  
  .router-view-area {
      flex-grow: 1;
      overflow-y: auto;
      background-color: #f5f7fa;
  }
</style>