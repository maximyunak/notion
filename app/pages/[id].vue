<script setup lang="ts">

import type {FlatTreeNode} from "~/types/TreeNode";
import type {ContentBlock, PageContent} from "~/types/PageContent";

const store = useContentStore();

const route = useRoute();

await store.getPageContent(route.params.id as string)

const onInput = (e: Event) => {
  const el = e.target as HTMLElement;

  if (el.innerHTML === '<br>') {
    el.innerHTML = '';
  }
};

const updateContent = (updated: ContentBlock) => {
  store.updatePageContent(updated);
}

const editPageTitle = (e: Event) => {
  const el = e.target as HTMLElement;

  store.editPageTitle(el.innerText);
};

</script>

<template>
  <div class="w-full h-full flex flex-col justify-center max-w-[700px]">
    <h1
        @blur="editPageTitle"
        @input="onInput"
        @focus="onInput"
        contenteditable="true"
        placeholder="Enter page title"
        data-content-editable-leaf="true"
        spellcheck="true"
        class="editable cursor-text break-words whitespace-pre-wrap text-6xl font-bold pl-18">
      {{ store?.pageData?.label }}
    </h1>
    <div class="w-full h-full mt-10">
      <ContentBlock
          v-for="block in store.pageContent?.blocks"
          :block="block"
          @update="updateContent"
          @empty="onInput"
      />
    </div>
  </div>
</template>

<style scoped>
</style>