<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { gsap } from 'gsap';

const section1 = ref<HTMLElement | null>(null);

onMounted(() => {
    if (section1.value) {
        gsap.from(section1.value.children, {
            opacity: 0,
            y: 20,
            stagger: 0.3,
            scrollTrigger: {
                trigger: section1.value,
                start: 'top 40%',
                end: 'bottom 45%',
                scrub: true,
                // @ts-ignore
                onLeave: () => gsap.to(section1.value.children, { opacity: 0 }),
                // markers: true, // Utile pour le débogage, à retirer en production
            },
        });
    }
});
</script>

<template>
    <div class=" container-section">
        <div ref="section1" class="section1">
            <h2>Titre S1</h2>
            <p>
                Lorem ipsum dolor sit amet <span>consectetur adipisicing elit</span>. Magnam fugit, doloremque accusamus
                recusandae suscipit blanditiis, architecto eum ab accusantium dignissimos animi consequatur, pariatur
                qui delectus odio consectetur atque aut eius!
                Qui, error. Perspiciatis, voluptatem. Laudantium veniam deleniti temporibus
            </p>
        </div>
    </div>
</template>

<style scoped>
.container-section {
    position: relative;
    color: aliceblue;
    width: 30%;
}

.container-section>h2,
.container-section>p {
    position: fixed;
    margin: 0;
}

.section1 {
    position: relative;
    display: flex;
    flex-direction: column;
    left: 30vw;
    height: 200px;
}

.section1>h2,
.section1>p {
    margin: 0;
}

span {
    background-color: #00acd4;
    color: rgb(0, 66, 18);
    padding: 1px;
}
</style>