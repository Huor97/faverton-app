<script setup lang="ts">
const path = '/models/bird.glb'
const { scene, animations } = await useGLTF(path, { draco: true })

const { actions } = useAnimations(animations, scene)

// Play ALL animations (wings, body, etc.) simultaneously
if (actions) {
  for (const action of Object.values(actions)) {
    action?.play()
  }
}

const BIRD_FLIGHT_SPEED = 0.3
const SCREEN_RIGHT_BOUNDARY = 15
const SCREEN_LEFT_BOUNDARY = -15

const { onLoop, pause } = useRenderLoop()

onLoop(({ delta }) => {
  if (scene) {
    // Vitesse de déplacement
    scene.position.x += BIRD_FLIGHT_SPEED * delta

    // Remise à zéro quand ils sortent de l'écran (Loop)
    if (scene.position.x > SCREEN_RIGHT_BOUNDARY) {
      scene.position.x = SCREEN_LEFT_BOUNDARY
    }
  }
})

onUnmounted(() => {
  pause()
})
// NOTE: Get the dimensions of the bird
// if (scene) {
//   const box = new Box3().setFromObject(scene)
//   const size = new Vector3()
//   box.getSize(size)
//   console.log('📏 Bird Dimensions (Units):', size)
// }
</script>

<template>
  <primitive v-if="scene" :object="scene" :scale="[0.01, 0.01, 0.01]" :position="[0, 1, 0]" :rotation="[0, 1.57, 0]" />
</template>