import { onMounted, ref } from "vue";


export function useRef () {
    const section1 = ref<HTMLElement | null>(null);
    onMounted(() => {
        if (section1.value) {
          gsap.from(section1.value.children, {
            opacity: 0,
            y:20,
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

    return section1
}