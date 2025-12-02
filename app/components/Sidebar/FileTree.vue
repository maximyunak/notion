<script setup lang="ts">

import type {TreeNode} from "~/types/TreeNode";

defineProps<{ nodes: TreeNode[] }>()

const toggleNode = (node: TreeNode): void => {
  node.open = !node.open;
}
</script>

<template>
  <div class="ml-1" v-for="node in nodes" :key="node.id">
    <div
        :class="{
          active: node.id === 'file-2',
        }"
        @click="toggleNode(node)"
        class="relative flex flex-row items-center justify-between w-full font-medium text-sm px-2.5 py-1.5 hover:bg-elevated cursor-pointer rounded-md text-white transition-colors">
      <span>{{ node.label }}</span>
      <UIcon name="i-lucide:chevron-down" class="transition-transform" :class="{
        'rotate-180': node.open,
      }"
             v-if="node.children"
      />
    </div>

    <Transition name="collapse" mode="out-in">
      <div class="ml-3 border-s border-default isolate" v-if="node.open">
        <SidebarFileTree :nodes="node.children" v-if="node.children"/>
      </div>
    </Transition>

  </div>

</template>

<style scoped>

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