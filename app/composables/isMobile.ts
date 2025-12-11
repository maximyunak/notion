export const useIsMobile = (breakpoint: number = 560) => {
    const isMobile = ref(false)

    onMounted(() => {
        isMobile.value = window.innerWidth <= breakpoint;
    })
    return isMobile
}