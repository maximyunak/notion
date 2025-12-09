<script setup lang="ts">
import type {DropDownItem} from "~/types/DropDown";

const {items, icon} = defineProps<{ items: DropDownItem[], icon: string }>();
defineEmits<{
  (e: 'create', type: string, prevBlockId: string): void;
}>()

const isOpen = ref(false)

const onSelect = (item: DropDownItem) => {
  item.onSelect()
  isOpen.value = false
}
</script>

<template>
  <div class="relative"
       @mouseleave="isOpen = false">
    <UButton variant="ghost"
             :icon="icon"
             @click="isOpen=!isOpen"
    />
    <Transition>
      <div v-if="isOpen" class="absolute top-full z-50 shadow-lg left-1/2 -translate-x-1/2 bg-muted rounded-sm"
      >
        <div @click="onSelect(item)"
             v-for="item in items"
             class="px-3 hover:bg-accented cursor-pointer py-1 my-1 transition-colors flex gap-2 items-center"
             :class="{
                'bg-error-500 hover:bg-error-400': item.color === 'error'
             }">
          <UButton v-if="item.icon" variant="ghost" :icon="item.icon" class="-ml-2"/>
          {{ item.label }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>

</style>