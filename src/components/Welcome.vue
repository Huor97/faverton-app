<script setup lang="ts">
import { TresCanvas } from "@tresjs/core";
import {
  OrbitControls,
  RoundedBox,
  MeshGlassMaterial,
  GLTFModel,
  MouseParallax,
  Text3D,
} from "@tresjs/cientos";

// const path = "src/assets/solar-panel.glb";
// const path = "src/assets/earth/scene.glb";
const pathEarh = "src/assets/earth.glb";
</script>
<template>
  <TresCanvas window-size>
    <TresPerspectiveCamera :position="[0, 0, 5]" />
    <!-- <OrbitControls /> -->
    <!-- <TresAxesHelper /> -->
    <!-- <TresGridHelper /> -->
    <Suspense>
      <Text3D
        :position="[0, 0, -3]"
        :scale="[3, 7, 2]"
        font="src/assets/Concert.json"
      >
        FAVERTON
        <TresMeshNormalMaterial />
      </Text3D>
    </Suspense>

    <Suspense>
      <GLTFModel
        :position="[0, -0.7, 0.1]"
        :path="pathEarh"
        :scale="[0.02, 0.02, 0.02]"
      />
    </Suspense>

    <TresMesh>
      <RoundedBox :scale="[1.5, 1.5, 1.5]" :args="[1, 1, 1, 2, 0.1]">
        <MeshGlassMaterial />
      </RoundedBox>
    </TresMesh>
    <TresDirectionalLight :intensity="1" :position="[3, 4, -2]" />
    <TresAmbientLight :intensity="1" />
    <MouseParallax :factor="1" :ease="3" />
  </TresCanvas>
</template>
<style scoped></style>
