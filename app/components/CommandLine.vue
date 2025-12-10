<script setup lang="ts">

import type {BlockType, ContentBlock} from "~/types/PageContent";
import type {DropDownItem} from "~/types/DropDown";

const emit = defineEmits<{
  (e: 'empty', event: Event): void,
  (e: 'create', block: ContentBlock, prevBlockId?: string): void,
}>();

const isHover = ref(false)
const isFocus = ref(false)
const value = ref('')

const addItems = ref<DropDownItem[]>([
  {
    label: 'H1',
    onSelect: () => createContentBlock('h1'),
  },
  {
    label: 'H2',
    onSelect: () => createContentBlock('h2'),
  },
  {
    label: 'H3',
    onSelect: () => createContentBlock('h3'),
  },
  {
    label: 'H4',
    onSelect: () => createContentBlock('h4'),
  },
  {
    label: 'H5',
    onSelect: () => createContentBlock('h5'),
  },
  {
    label: 'H6',
    onSelect: () => createContentBlock('h6'),
  },
  {
    label: 'Text',
    onSelect: () => createContentBlock('text'),
  },
  {
    label: 'Image',
    onSelect: () => createContentBlock('image'),
  },
  {
    label: 'Page',
    onSelect: () => createContentBlock('page'),
  },
  {
    label: 'Link',
    onSelect: () => createContentBlock('link'),
  },
  {
    label: 'Youtube',
    onSelect: () => createContentBlock('youtube'),
  },
  {
    label: 'Table',
    onSelect: () => createContentBlock('table'),
  }
]);

const createContentBlock = (type: BlockType = 'text') => {
  const newBlock = {
    type: type,
    id: Math.random().toString(36).substr(7),
    value: ''
  } as ContentBlock
  if (type === 'table') {
    newBlock.value = [
      ['Header1', 'Header2'],
      ['', ''],
    ]
  }
  emit("create", newBlock);
};

const isCommand = ref(false)
const onInput = (e: Event): void => {
  emit('empty', e)
  const text = (e.target as HTMLElement).innerText;

  isCommand.value = text.startsWith('/');
}

const onCreate = (item: DropDownItem) => {
  item.onSelect()
  const el = document.getElementById('command')
  if (el) el.innerText = ''

  value.value = ''
  isCommand.value = false
}
</script>

<template>
  <div
      @mouseenter="isHover = true"
      @mouseleave="isHover = false"
      class="relative opacity-0 transition-opacity"
      :class="{
        'opacity-100': isHover || value || isFocus,
      }"
  >

    <Transition>
      <div v-if="isCommand" class="absolute top-7 z-50 shadow-lg bg-muted rounded-sm"
      >
        <div @click="onCreate(item)"
             v-for="item in addItems"
             class="px-3 hover:bg-accented cursor-pointer py-1 my-1 transition-colors flex gap-2 items-center">
          {{ item.label }}
        </div>
      </div>
    </Transition>

    <p id="command"
       class="w-full"
       @input="onInput"
       @focus="isFocus=true"
       @blur="isFocus=false"
       type="text"
       contenteditable="true"
       placeholder="Write, / for commands">{{ value }}</p>

  </div>
</template>

<style scoped>

</style>