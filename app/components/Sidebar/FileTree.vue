<script setup lang="ts">
import draggable from "vuedraggable";

import type {TreeNode} from "~/types/TreeNode";

const {parentId, nodes} = defineProps<{ nodes: TreeNode[], parentId: string | null }>();

const route = useRoute()
const router = useRouter()
const store = useFileStore()

const toggleNode = (node: TreeNode): void => {
  node.open = !node.open;
}

const hoveredArrow = ref<Record<string, boolean>>({})

const createPage = async (parentId: string) => {
  const newPageId = await store.createPage({}, parentId)

  router.push(`/${newPageId}`)
}

const deletePage = (nodeId: string) => {
  store.deletePage(nodeId)
  if (!findNode(route.params.id as string, store.fileTree)) {
    router.push('/');
  }
}

const onDropEnd = (e: any) => {
  store.syncParentIds()
};
</script>


<template>

  <draggable
      :list="nodes"
      :group="{ name: 'children', pull: true, put: true }"
      animation="150"
      item-key="id"
      ghost-class="opacity-50"
      :data-parent-id="parentId"
      @end="onDropEnd"
  >
    <template #item="{element}">
      <div>

        <NuxtLink
            :to="`/${element.id}`"
            active-class="active"
            @mouseenter="hoveredArrow[element.id] = true"
            @mouseleave="hoveredArrow[element.id] = false"

            class="relative flex flex-row items-center justify-between w-full font-medium text-sm px-2.5 py-1.5 hover:bg-elevated cursor-pointer rounded-md transition-colors">

          <!--   название   -->
          <div class="flex items-center gap-2 max-w-2/3">

            <!--    кнопка раскрытия/иконки файла    -->
            <div class="relative flex flex-row items-center">
              <UButton
                  v-if="hoveredArrow[element.id]"
                  class="size-6"
                  variant="subtle"
                  @click.prevent="toggleNode(element)"
              >
                <UIcon name="i-lucide:chevron-down" :class="{ 'rotate-180': element.open }"
                       class=" transition-transform size-4 absolute bottom-1/2 right-1/2 translate-1/2"></UIcon>
              </UButton>
              <UButton variant="ghost" v-else class="size-6" icon="mdi:file-document"/>
            </div>
            <span class="truncate">{{ element.label }}</span>
          </div>

          <!--   кнопки справа   -->
          <Transition mode="out-in">
            <div class="flex items-center gap- max-h-6 absolute right-2" v-if="hoveredArrow[element.id]">
              <UButton variant="subtle" icon="material-symbols:delete" @click.prevent="deletePage(element.id)"/>

              <!--   создание   -->
              <UButton variant="subtle" icon="material-symbols:add" @click.prevent="createPage(element.id)"/>
            </div>
          </Transition>
        </NuxtLink>

        <Transition name="collapse" mode="out-in">
          <div class="ml-3 border-s border-default isolate">
            <SidebarFileTree :nodes="element.children"
                             :parentId="element.id"/>
            <span v-if="element.children.length === 0" class="text-sm pl-8 text-muted block pb-1">No pages inside</span>
          </div>
        </Transition>
      </div>
    </template>
  </draggable>

</template>

<style>

.active {
  background: var(--ui-bg-elevated);
}

.collapse-enter-from,
.collapse-leave-to {
  opacity: 0;
  max-height: 0;
}

.collapse-enter-to,
.collapse-leave-from {
  opacity: 1;
  max-height: 100vh;
}

.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
</style>