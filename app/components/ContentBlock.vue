<script setup lang="ts">
import type {BlockType, ContentBlock} from "~/types/PageContent";
import type {FlatTreeNode} from "~/types/TreeNode";
import type {DropDownItem} from "~/types/DropDown";

const {block} = defineProps<{ block: ContentBlock }>();
const emit = defineEmits<{
  (e: 'create', block: ContentBlock, prevBlockId: string): void,
  (e: 'empty', event: Event): void,
  (e: 'update', block: ContentBlock): void,
}>();

const store = useContentStore();
const pagesStore = useFileStore()
const isHover = ref(false);

const edit = (event: Event) => {
  const el = event.target as HTMLElement;
  const updated: ContentBlock = {
    ...block,
    value: el.innerText
  }
  emit("update", updated);
}

const optionItems = ref<DropDownItem[]>([
  {
    label: 'delete',
    icon: 'material-symbols:delete',
    color: 'error',
    onSelect() {
      store.deleteContentBlock(block.id)
    }
  }
])

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
  emit("create", newBlock, block.id);
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

const updateContentBlock = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  const updated = {
    ...block,
    value: target.value,
  }
  store.updatePageContent(updated)
}

const updateContentBlockFromValue = (event: FlatTreeNode) => {
  const updated: ContentBlock = {
    ...block,
    value: event.id,
  }

  store.updatePageContent(updated)
};

</script>

<template>
  <div @mouseenter="isHover = true" @mouseleave="isHover = false" class="flex items-center relative gap-2">

    <div :class="isHover ? 'opacity-100' : 'opacity-0'" class="flex gap-2 w-18">
      <DropDown :items="addItems" icon="material-symbols:add-2"/>
      <DropDown :items="optionItems" class="drag-handle" icon="teenyicons:drag-vertical-solid"/>
    </div>

    <h1 :id=" `block-${block.id}`"
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

    <div v-if="block.type==='image'" class="relative">

      <img :id="`block-${block.id}`"
           class="block mb-2"
           :src="block.value"
           alt="user-image"
           v-if="block.value"
           @keydown.enter.shift.prevent="createContentBlock('text')"
      />
      <UModal title="Update image link">
        <UButton icon="material-symbols:edit-outline-rounded" variant="subtle" class="absolute top-5 right-5"
                 v-if="block.value"/>
        <template #body>
          <UInput :value="block.value" class="w-full" @blur="updateContentBlock"/>
        </template>
      </UModal>

      <input :id="`block-${block.id}`"
             v-if="!block.value"
             placeholder="Link to image"
             @keydown.enter="updateContentBlock"
             @keydown.esc="store.deleteContentBlock(block.id)"
             @blur="updateContentBlock"/>

    </div>

    <div v-if="block.type === 'youtube'" class="mt-2">
      <iframe id="inlineFrameExample"
              title="Inline Frame Example"
              src="https://www.youtube.com/embed/GHaAsolqvX4"></iframe>
    </div>


    <div class="flex gap-2 w-full items-center"
         v-if="block.type==='link'">
      <UPopover mode="hover" :open-delay="300" :close-delay="300"
                :content="{ align: 'start', side: 'bottom', sideOffset: 8 }">
        <a target="_blank"
           class="block link"
           :id="`block-${block.id}`"
           :href="block.value"
           v-if="block.value"
        >
          {{ block.value }}
        </a>

        <template #content>
          <div class="w-auto p-1 ">
            <input :value="block.value" placeholder="edit link" contenteditable="true"
                   @input="updateContentBlock"/></div>
        </template>
      </UPopover>

      <input :id="`block-${block.id}`"
             v-if="!block.value"
             placeholder="Link"
             @keydown.enter="updateContentBlock"
             @keydown.esc="store.deleteContentBlock(block.id)"
             @blur="updateContentBlock"/>

    </div>

    <div v-if="block.type === 'page'">
      <UInputMenu v-if="!block.value" placeholder="Start typing or select a page"
                  :items="pagesStore.flatTree"
                  @update:model-value="updateContentBlockFromValue"
                  class="base-button w-48"
      />
      <div v-else>
        <NuxtLink :href="block.value">
          <UButton variant="subtle" icon="mdi:file-document">
            {{ pagesStore.flatTree.find((el) => el.id === block.value)?.label || 'Unknown page' }}
          </UButton>
        </NuxtLink>
      </div>
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

a.link {
  text-decoration: underline;
  color: #2563eb;
}
</style>
