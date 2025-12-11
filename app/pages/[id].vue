<script setup lang="ts">
import draggable from "vuedraggable";
import type {FlatTreeNode} from "~/types/TreeNode";
import type {ContentBlock, PageContent} from "~/types/PageContent";

const store = useContentStore();
const fileStore = useFileStore();

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

const createContentBlock = async (block: ContentBlock, prevBlockId: string = store.pageContent?.blocks[store.pageContent.blocks.length - 1]?.id ?? '', isFocus: boolean = true) => {
  await store.createContentBlock(block, prevBlockId)
  if (!isFocus) return
  await nextTick(() => {
    const el = document.getElementById(`block-${block.id}`);
    if (el) el.focus();
  })
}


const titleValue = computed({
  get() {
    return store.pageContent?.title ?? ''
  },
  set(value: string) {
    if (!store.pageContent) return
    store.pageContent.title = value;
    fileStore.editTitle(store.pageContent.id, value)
  }
})

useHead(() => ({
  title: store.pageContent
      ? `Notion | ${store.pageContent?.title || 'Page'}`
      : 'Notion | Page'
}))
const isMobile = useIsMobile()
</script>

<template>
  <div class="w-full h-full flex flex-col justify-center max-w-[700px]">
    <input
        @blur="store.savePageTitle"
        v-model="titleValue"
        placeholder="Enter page title"
        class="cursor-text break-words whitespace-pre-wrap text-5xl z-50 font-bold" :class="{
          'pl-18' : !isMobile,
        }"/>

    <div class="w-full h-full mt-5 sm:mt-10">
      <draggable
          animation="150"
          ghost-class="opacity-50"
          v-if="store.pageContent"
          :list="store.pageContent.blocks"
          item-key="id"
          @dragend="store.savePositions()"
          handle=".drag-handle"
      >
        <template #item="{ element }">
          <ContentBlock
              :block="element"
              @update="updateContent"
              @empty="onInput"
              @create="createContentBlock"
          />
        </template>
      </draggable>

      <CommandLine class="pl-18" @empty="onInput" @create="createContentBlock"/>

    </div>
  </div>
</template>

<style scoped>
</style>