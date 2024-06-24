<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { gsap } from 'gsap';

const section4 = ref<HTMLElement | null>(null);

onMounted(() => {
    if (section4.value) {
        gsap.from(section4.value.children, {
            opacity: 0,
            y: 20,
            stagger: 0.3,
            scrollTrigger: {
                trigger: section4.value,
                start: 'top 80%',
                end: 'bottom 90%',
                scrub: true,
                // @ts-ignore
                onLeave: () => gsap.to(section4.value.children, { opacity: 0 }),
                // markers: true, // Utile pour le débogage, à retirer en production
            },
        });
    }
});

</script>
<template>

    <div class="container-section">
        <div ref="section4" class="section4">
            <h2>Titre S4</h2>
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



.section4 {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 200px;
    left: 25vw;
}

.section4>h2,
.section4>p {
    margin: 0;
}

span {
    background-color: #00acd4;
    color: rgb(0, 66, 18);
    padding: 1px;
}
</style>