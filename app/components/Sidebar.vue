<script setup lang="ts">
import type {NavigationMenuItem} from '@nuxt/ui'

const pgs = ref(
    [
      {
        id: 1,
        name: "IT",
        type: 'file'
      },
      {
        id: 2,
        name: "Japan",
        type: "folder",
        children: [
          {
            id: 3,
            label: 'folder',
            children: [
              {
                id: 3,
                label: 'folder',
                children: [
                  {
                    id: 3,
                    label: 'folder',
                    children: [
                      {
                        id: 3,
                        label: 'folder',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      }
    ]
)

const items = computed<NavigationMenuItem[]>(() => {
  return [pgs.value.map(pg => (
      {
        label: pg.name,
        children: pg.children,
        open: pg?.open ?? true,
        icon: pg.type === "folder" ? "material-symbols:folder" : "material-symbols:folder-open",
      }
  ))]
})


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

      <UNavigationMenu
          :collapsed="collapsed"
          :items="items"
          orientation="vertical"
      />
    </template>

  </UDashboardSidebar>
</template>

