<template>
  <div class="absolute inset-0 z-0 select-none" aria-hidden="true">
    <!-- Background Content -->
    <div class="absolute inset-0 z-0">
      <img
        src="/images/background.png"
        alt=""
        class="w-full h-full object-cover opacity-80"
      />
      <!-- Gradient Overlay for better text visibility -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
    </div>

    <!-- Animated Clouds -->
    <div class="clouds-container absolute inset-0 z-10 pointer-events-none">
      <!-- Lower Layer -->
      <div class="clouds clouds-lower"></div>
      
      <!-- Upper Layer (Higher & slower for depth) -->
      <div class="clouds clouds-upper" style="opacity: 0.6; animation-duration: 65s;"></div>
    </div>
  </div>
</template>

<style scoped>
.clouds-container {
  overflow: hidden;
}

.clouds {
  position: absolute;
  white-space: nowrap;
  will-change: transform;
  animation: marquee 48s linear infinite;
  /* Masque plus agressif en haut (40%) pour cacher la ligne */
  -webkit-mask-image: linear-gradient(to bottom, transparent 5%, black 40%, black 90%, transparent 100%);
  mask-image: linear-gradient(to bottom, transparent 5%, black 40%, black 90%, transparent 100%);
  
  /* CSS Background Optimization */
  background-image: url('/images/clouds.webp');
  background-repeat: repeat-x;
  background-size: 150vw auto;
  width: 300vw; /* Ensure enough width for the loop */
  height: 100vh; /* Fallback height */
}

/* Mobile Positions (Default) - Closer to center */
.clouds-lower {
  top: 30vh;
}

.clouds-upper {
  top: 15vh;
}

/* Desktop Positions - Higher up */
@media (min-width: 768px) {
  .clouds-lower {
    top: 10vh;
  }
  .clouds-upper {
    top: -5vh;
  }
}



@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>
