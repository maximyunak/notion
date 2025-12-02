// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: {enabled: true},
    modules: ['@nuxt/ui', '@pinia/nuxt'],
    ui: {
        fonts: false,
        theme: {
            defaultVariants: {
                color: 'neutral',
                size: 'sm'
            }
        }
    },
    css: ['~/assets/css/main.css'],

    app: {
        head: {
            title: 'Notion',
            link: [{rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}],
        },
        pageTransition: {name: 'page', mode: 'out-in'},
        layoutTransition: {name: 'page', mode: 'out-in'},
    },
})
