<script setup lang="ts">

import type {FlatTreeNode} from "~/types/TreeNode";
import type {PageContent} from "~/types/PageContent";

const store = useFileStore();

const pageData = ref<{
  page: FlatTreeNode,
  content: PageContent
}>();

const route = useRoute();

pageData.value = await store.getPageContent(route.params.id as string)

const onInput = (e: Event) => {
  const el = e.target as HTMLElement;

  if (el.innerHTML === '<br>') {
    el.innerHTML = '';
  }
};
</script>

<template>
  <div class="w-full h-full flex flex-col justify-center max-w-[700px]">
    <h1
        @input="onInput"
        @focus="onInput"
        contenteditable="true"
        placeholder="Enter page title" data-content-editable-leaf="true" spellcheck="true"
        class="editable cursor-text break-words whitespace-pre-wrap text-6xl font-bold pl-18">
      {{ pageData?.page.label }}
    </h1>
    <div class="w-full h-full mt-10">
      <ContentBlock
          :block="block"
          v-for="block in pageData?.content.blocks"
      />
    </div>
  </div>
</template>

<style scoped>
</style>