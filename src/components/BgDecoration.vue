<template>
  <div class="bg-decoration">
    <div class="bg-circle"></div>
    <div class="bg-circle"></div>
    <div class="bg-circle"></div>
  </div>
</template>

<style scoped>
.bg-decoration {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255,107,53,0.08) 0%, rgba(255,140,90,0.04) 100%);
  animation: float 20s ease-in-out infinite;
}

.bg-circle:nth-child(1) {
  width: 600px;
  height: 600px;
  top: -200px;
  right: -100px;
}

.bg-circle:nth-child(2) {
  width: 400px;
  height: 400px;
  bottom: -100px;
  left: -100px;
  animation-delay: -7s;
}

.bg-circle:nth-child(3) {
  width: 300px;
  height: 300px;
  top: 50%;
  left: 50%;
  animation-delay: -14s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(20px, -20px) scale(1.05);
  }
}
</style>
