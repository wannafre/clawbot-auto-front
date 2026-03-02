<template>
  <div id="app">
    <ToastContainer />
    <BgDecoration />
    <AppHeader />
    <div class="container">
      <main class="main-content">
        <router-view></router-view>
      </main>
      <aside class="sidebar">
        <StatsCard />
      </aside>
    </div>
    <AppFooter />
  </div>
</template>

<script setup>
import ToastContainer from './components/ToastContainer.vue'
import BgDecoration from './components/BgDecoration.vue'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import StatsCard from './components/StatsCard.vue'
</script>

<style scoped>
#app {
  min-height: 100vh;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 40px;
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 32px;
}

.main-content {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 28px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.12);
  overflow: hidden;
  min-height: 500px;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

@media (max-width: 1024px) {
  .container {
    grid-template-columns: 1fr;
    padding: 24px;
  }
  .sidebar {
    display: none;
  }
}
</style>
