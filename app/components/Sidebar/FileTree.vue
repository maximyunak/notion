<script setup lang="ts">

import type {TreeNode} from "~/types/TreeNode";
import type {DropdownMenuItem} from "#ui/components/DropdownMenu.vue";

defineProps<{ nodes: TreeNode[] }>()

const store = useFileStore()

const toggleNode = (node: TreeNode): void => {
  node.open = !node.open;
}

const hoveredArrow = ref<Record<string, boolean>>({})

const createPage = (parentId: string) => {
  store.createPage({}, parentId)
}

const route = useRoute()
const router = useRouter()

const deletePage = (nodeId: string) => {
  store.deletePage(nodeId)
  if (!findNode(route.params.id as string, store.fileTree)) {
    router.push('/');
  }
}

</script>


<template>

  <div class="ml-1" v-for="node in nodes" :key="node.id">
    <NuxtLink
        :to="`/${node.id}`"
        active-class="active"
        @mouseenter="hoveredArrow[node.id] = true"
        @mouseleave="hoveredArrow[node.id] = false"

        class="relative flex flex-row items-center justify-between w-full font-medium text-sm px-2.5 py-1.5 hover:bg-elevated cursor-pointer rounded-md text-white transition-colors">

      <!--   название   -->
      <div class="flex items-center gap-2">

        <!--    кнопка раскрытия/иконки файла    -->
        <div class="relative flex flex-row items-center">
          <UButton
              v-if="hoveredArrow[node.id]"
              class="size-6"
              variant="subtle"
              @click.prevent="toggleNode(node)"
          >
            <UIcon name="i-lucide:chevron-down" :class="{ 'rotate-180': node.open }"
                   class=" transition-transform size-4 absolute bottom-1/2 right-1/2 translate-1/2"></UIcon>
          </UButton>
          <UButton variant="ghost" v-else class="size-6" icon="mdi:file-document"/>
        </div>
        <span>{{ node.label }}</span>
      </div>

      <!--   кнопки справа   -->
      <Transition mode="out-in">
        <div class="flex items-center gap-2 max-h-6" v-if="hoveredArrow[node.id]">
          <UButton variant="ghost" icon="material-symbols:delete" @click.prevent="deletePage(node.id)"/>

          <!--   создание   -->
          <UButton variant="ghost" icon="material-symbols:add" @click.prevent="createPage(node.id)"/>
        </div>
      </Transition>
    </NuxtLink>

    <Transition name="collapse" mode="out-in">
      <div class="ml-3 border-s border-default isolate" v-if="node.open">
        <SidebarFileTree :nodes="node.children" v-if="node.children.length"/>
        <span v-else class="text-sm pl-8 text-muted">Nothing</span>
      </div>
    </Transition>
  </div>

</template>

<style>

.active {
  background: var(--ui-bg-elevated);
}

button:hover {
  background: var(--ui-bg-accented) !important;
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