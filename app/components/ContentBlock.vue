<script setup lang="ts">
import type {BlockType, ContentBlock} from "~/types/PageContent";
import type {DropdownMenuItem} from "#ui/components/DropdownMenu.vue";

const {block} = defineProps<{ block: ContentBlock }>();
const emit = defineEmits<{
  (e: 'update' | 'create', block: ContentBlock): void,
  (e: 'empty', event: Event): void,
}>();


const store = useContentStore();

const isHover = ref(false);

const edit = (event: Event) => {
  const el = event.target as HTMLElement;
  const updated: ContentBlock = {
    ...block,
    value: el.innerText
  }
  emit("update", updated);
}

const optionItems = ref<DropdownMenuItem[]>([
  {
    label: 'delete',
    icon: 'material-symbols:delete',
    color: 'error',
    onSelect() {
      store.deleteContentBlock(block.id)
    }
  }
])

const addItems = ref<DropdownMenuItem[]>([
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
  const block = {
    type: type,
    id: Math.random().toString(36).substr(7),
    value: ''
  } as ContentBlock
  emit("create", block);
};

const deleteOnBackspace = (e: KeyboardEvent) => {
  if (e.key !== 'Backspace') return
  const index = store.pageContent?.blocks.findIndex(b => b.id === block.id)

  if (index === undefined || index === -1) return;
  console.log('dd', block.value)

  const el = e.target as HTMLElement;

  if (el.innerText === '') {
    e.preventDefault();
    store.deleteContentBlock(block.id);
    const prev = store.pageContent?.blocks[index - 1]
    const el = document.getElementById(`block-${prev?.id}`);

    if (!el) return;

    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }
}

</script>

<template>
  <div @mouseenter="isHover = true" @mouseleave="isHover = false" class="flex items-center relative gap-2">

    <div :class="isHover ? 'opacity-100' : 'opacity-0 pointer-events-none'" class="flex gap-2 w-18">
      <UDropdownMenu
          :items="addItems"
          :content="{
            align: 'start',
            side: 'left',
            sideOffset: 0,
          }"
          :ui="{
            content: 'w-48'
          }">
        <UButton icon="material-symbols:add-2"
                 variant="ghost"/>
      </UDropdownMenu>
      <UDropdownMenu
          :items="optionItems"
          :content="{
            align: 'start',
            side: 'left',
            sideOffset: 0,
          }"
          :ui="{
            content: 'w-48'
          }">
        <UButton variant="ghost"
                 class="drag-handle cursor-grab active:cursor-grabbing"
                 icon="teenyicons:drag-vertical-solid"/>
      </UDropdownMenu>
    </div>

    <h1 :id="`block-${block.id}`"
        @keydown.enter.shift.prevent="()=> createContentBlock('text')"
        @keydown="deleteOnBackspace"
        @input="$emit('empty', $event)"
        placeholder="Type anything"
        @blur="edit"
        v-if="block.type === 'h1'"
        contenteditable="true">{{ block.value }}</h1>

    <h2 :id="`block-${block.id}`"
        @keydown.enter.shift.prevent="createContentBlock('text')"
        @keydown="deleteOnBackspace"
        @input="$emit('empty', $event)"
        placeholder="Type anything"
        @blur="edit" v-if="block.type === 'h2'"
        contenteditable="true">{{ block.value }}</h2>

    <h3 :id="`block-${block.id}`"
        @keydown.enter.shift.prevent="createContentBlock('text')"
        @keydown="deleteOnBackspace"
        @input="$emit('empty', $event)"
        placeholder="Type anything"
        @blur="edit"
        v-if="block.type === 'h3'"
        contenteditable="true">{{ block.value }}</h3>

    <h4 :id="`block-${block.id}`"
        @keydown.enter.shift.prevent="createContentBlock('text')"
        @keydown="deleteOnBackspace"
        @input="$emit('empty', $event)"
        placeholder="Type anything"
        @blur="edit"
        v-if="block.type === 'h4'"
        contenteditable="true">{{ block.value }}</h4>

    <h5 :id="`block-${block.id}`"
        @keydown.enter.shift.prevent="createContentBlock('text')"
        @keydown="deleteOnBackspace"
        @input="$emit('empty', $event)"
        placeholder="Type anything"
        @blur="edit"
        v-if="block.type === 'h5'"
        contenteditable="true">{{ block.value }}</h5>

    <h6 :id="`block-${block.id}`"
        @keydown.enter.shift.prevent="createContentBlock('text')"
        @keydown="deleteOnBackspace"
        @input="$emit('empty', $event)"
        placeholder="Type anything"
        @blur="edit"
        v-if="block.type === 'h6'"
        contenteditable="true">{{ block.value }}</h6>

    <p :id="`block-${block.id}`"
       @keydown.enter.shift.prevent="createContentBlock('text')"
       @keydown="deleteOnBackspace"
       @input="$emit('empty', $event)"
       placeholder="Type anything"
       @blur="edit"
       v-if="block.type === 'text'"
       contenteditable="true">{{ block.value }}</p>

    <img :id="`block-${block.id}`"
         :src="block.value"
         alt="user-image"
         v-if="block.type === 'image'"
         @keydown.enter.shift.prevent="createContentBlock('text')"
    />

    <div class="flex gap-2 w-full items-center"
         v-if="block.type==='link'">

      <ULink target="_blank" :href="block.value" class="inline">
        <UButton icon="material-symbols-light:link" variant="subtle"/>
      </ULink>
      <ULink :id="`block-${block.id}`"
             contenteditable="true"
             @input="$emit('empty', $event)"
             @blur="edit">{{ block.value }}
      </ULink>
    </div>

    <div v-if="block.type === 'youtube'">
      <iframe id="inlineFrameExample"
              title="Inline Frame Example"
              src="https://www.youtube.com/embed/GHaAsolqvX4"></iframe>
    </div>

  </div>
</template>

<style scoped>
div > *:not(button, div, a) {
  width: 100%;
  overflow-wrap: break-word;
  white-space: pre-wrap;
}

iframe {
  width: 700px;
  height: 200px;
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
