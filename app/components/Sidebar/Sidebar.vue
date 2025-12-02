<script setup lang="ts">
import type {NavigationMenuItem} from '@nuxt/ui'
import FileTree from "~/components/Sidebar/FileTree.vue";

const store = useFileStore()


</script>

<template>
  <UDashboardSidebar collapsible :ui="{ footer: 'border-t border-default' }">
    <template #header="{ collapsed }">
      <UIcon name="devicon-plain:nuxt-wordmark" class="size-20 text-primary mx-auto"/>
    </template>

    <template #default="{ collapsed }">
      <UButton
          :label="collapsed ? undefined : 'Search...'"
          icon="i-lucide-search"
          color="neutral"
          variant="outline"
          block
          :square="collapsed"
      >
        <template v-if="!collapsed" #trailing>
          <div class="flex items-center gap-0.5 ms-auto">
            <UKbd value="meta" variant="subtle"/>
            <UKbd value="K" variant="subtle"/>
          </div>
        </template>
      </UButton>


      <div class="flex flex-col">
        <SidebarFileTree :nodes="store.fileTree"/>
      </div>
    </template>

  </UDashboardSidebar>
</template>

<!--      <UNavigationMenu-->
<!--          :collapsed="collapsed"-->
<!--          :items="store.items"-->
<!--          orientation="vertical"-->
<!--      />-->

