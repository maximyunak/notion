// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: {enabled: true},
    modules: ['@nuxt/ui'],
    ui:{
        fonts:false,
        theme: {
            defaultVariants: {
                color: 'neutral',
                size: 'sm'
            }
        }
    },
    css: ['~/assets/css/main.css'],
})
