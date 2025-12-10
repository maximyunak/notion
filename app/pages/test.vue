<script setup lang="ts">
import NestedDraggable from "~/components/nested-draggable.vue";

const list = ref([
  {
    id: "dfds",
    name: "task 1",
    tasks: [
      {
        id: "aaaa",
        name: "task 2",
        tasks: []
      }
    ]
  },
  {
    id: "fff",
    name: "task 3",
    tasks: [
      {
        id: "dffds",
        name: "task 4",
        tasks: []
      }
    ]
  },
  {
    id: "ss",
    name: "task 5",
    tasks: []
  }
])

watchEffect(() => {
  console.log(list.value)
})
</script>

<template>
  <div>
    <NestedDraggable :list="list"/>

    <client-only>
      <ContentTable/>
    </client-only>
  </div>
</template>

<style scoped>

</style>