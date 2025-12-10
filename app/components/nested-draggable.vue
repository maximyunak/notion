<script setup lang="ts">
import draggable from "vuedraggable"

defineProps<{
  list: any[]
}>()
</script>

<template>
  <draggable
      tag="ul"
      :list="list"
      item-key="name"
      :group="{ name: 'tasks', pull: true, put: true }"
  >
    <template #item="{ element }">
      <li>
        {{ element.name }}
        <nested-draggable class="ml-3" :list="element.tasks"/>
      </li>
    </template>
  </draggable>
</template>
