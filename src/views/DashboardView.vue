<script setup>
    import SidebarMenu from '@/components/SidebarMenu.vue';
</script>

<template>
  <div class="main-layout">
    <SidebarMenu />
    
    <div class="content-area">
      <header>
        <h1>Menú principal</h1>
      </header>
      
      <RouterView /> 
    </div>
  </div>
</template>

<style scoped>
    .main-layout {
        display: flex; /* Permite que el sidebar y el contenido estén lado a lado */
        min-height: 100vh;
    }
    .content-area {
        flex-grow: 1; /* Ocupa el espacio restante */
        padding: 20px;
    }
    header {
        border-bottom: 1px solid #ccc;
        padding-bottom: 10px;
        margin-bottom: 20px;
    }
</style>