<script setup lang="ts">
import type {ContentBlock} from "~/types/PageContent";

defineProps<{ block: ContentBlock }>();

const isHover = ref(false);
</script>

<template>
  <div @mouseenter="isHover = true" @mouseleave="isHover = false" class="flex items-center relative gap-2">
    <div :class="isHover ? 'opacity-100' : 'opacity-0 pointer-events-none'" class="flex gap-2 w-18">

      <UButton icon="material-symbols:add-2"
               variant="ghost"/>
      <UButton variant="ghost" icon="teenyicons:drag-vertical-solid"/>
    </div>

    <h1 v-if="block.type === 'h1'" contenteditable="true">{{ block.value }}</h1>
    <h2 v-if="block.type === 'h2'" contenteditable="true">{{ block.value }}</h2>
    <h3 v-if="block.type === 'h3'" contenteditable="true">{{ block.value }}</h3>
    <h4 v-if="block.type === 'h4'" contenteditable="true">{{ block.value }}</h4>
    <h5 v-if="block.type === 'h5'" contenteditable="true">{{ block.value }}</h5>
    <h6 v-if="block.type === 'h6'" contenteditable="true">{{ block.value }}</h6>
    <p v-if="block.type === 'text'" contenteditable="true">{{ block.value }}</p>
  </div>
</template>

<style scoped>
div > *:not(button, div) {
  width: 100%;
}
h1 {
  font-size: 40px;
  font-weight: 700;
}

h2 {
  font-size: 36px;
  font-weight: 700;
}

h3 {
  font-size: 28px;
  font-weight: 600;
}

h4 {
  font-size: 22px;
  font-weight: 600;
}

h5 {
  font-size: 18px;
  font-weight: 500;
}

h6 {
  font-size: 16px;
  font-weight: 500;
}

p {
  font-size: 16px;
  line-height: 1.6;
}
</style>
