<script setup lang="ts">
import 'active-table';

const {data} = defineProps<{
  data: string[][]
}>()
const emit = defineEmits<{ (e: 'update', newData: string[][]): void }>()

interface ActiveTableElement extends HTMLElement {
  onDataUpdate: (data: string[][]) => void
}

let tableRef = ref<ActiveTableElement | null>(null)

const tableStyle = {
  borderRadius: '8px',
  width: '100%',
}

onMounted(() => {
  if (tableRef.value) {
    tableRef.value.onDataUpdate = (data: string[][]) => {
      emit('update', data)
    }
  }
})

</script>

<template>
  <div>
    <active-table
        ref="tableRef"
        :data="data"
        :table-style="tableStyle"
        :enterKeyMoveDown="true"
    />
  </div>
</template>

<style scoped>
</style>
