<script setup lang="ts">
const store = useFileStore()

await store.fetchPages()

const isMobile = useIsMobile(1023)

const contentStore = useContentStore()
</script>

<template>

  <UDashboardGroup>
    <UDashboardSidebar :ui="{ footer: 'border-t border-default' }">
      <template #header>
        <UIcon name="devicon-plain:nuxt-wordmark" class="size-20 text-primary mx-auto"/>
      </template>

      <template #default>
        <UButton
            label='Search...'
            icon="i-lucide-search"
            color="neutral"
            variant="outline"
            block
        >
          <template #trailing>
            <div class="flex items-center gap-0.5 ms-auto">
              <UKbd value="meta" variant="subtle"/>
              <UKbd value="K" variant="subtle"/>
            </div>
          </template>
        </UButton>

        <div class="flex flex-col">
          <SidebarFileTree v-if="store.fileTree?.length > 0"
                           :nodes="store.fileTree"
                           :parentId="null"/>
          <UButton variant="subtle" @click="store.createPage()">
            add
          </UButton>
        </div>
      </template>

    </UDashboardSidebar>

    <UDashboardPanel v-if="isMobile">
      <template #header>
        <UDashboardNavbar class="z-30" :title="contentStore.pageContent?.title" />
      </template>
    </UDashboardPanel>

  </UDashboardGroup>
</template>