<script setup lang="ts">
import type {BlockType, ContentBlock} from "~/types/PageContent";
import type {FlatTreeNode} from "~/types/TreeNode";
import type {DropDownItem} from "~/types/DropDown";
import {YouTubeGetID} from "~/utils/get-embed-youtube";
import {getHttpLink} from "~/utils/http-link";
import {isMobile} from "~/composables/isMobile";

const {block} = defineProps<{ block: ContentBlock }>();
const emit = defineEmits<{
  (e: 'create', block: ContentBlock, prevBlockId: string): void,
  (e: 'empty', event: Event): void,
  (e: 'update', block: ContentBlock): void,
}>();

const store = useContentStore();
const pagesStore = useFileStore()
const isHover = ref(false);
const isOpenModal = ref(false)

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
  },
  {
    label: 'edit',
    icon: 'material-symbols:edit',
    onSelect() {
      isOpenModal.value = true
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
  if (type === 'table') {
    newBlock.value = [
      ['Header1', 'Header2'],
      ['', ''],
    ]
  }
  emit("create", newBlock, block.id);
};

const deleteOnBackspace = (e: KeyboardEvent) => {
  if (e.key !== 'Backspace') return
  const index = store.pageContent?.blocks.findIndex(b => b.id === block.id)

  if (index === undefined || index === -1) return;

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

const updateContentBlock = (event?: Event, type?: BlockType): void => {
  const target = event?.target as HTMLInputElement;

  const updated = {
    ...block,
  }

  if (target) {
    updated.value = target.value;
  }

  if (type) {
    updated.type = type;
  }

  if (block.type === 'youtube') {
    const videoId = YouTubeGetID(target.value)
    updated.value = `https://www.youtube.com/embed/${videoId}`
  }

  store.updatePageContent(updated)
}

const updateTableBlock = (newData: string[][]): void => {
  const updated = {
    ...block,
    value: newData,
  } as ContentBlock

  store.updatePageContent(updated)
}

const updateContentBlockFromValue = (event: FlatTreeNode) => {
  const updated: ContentBlock = {
    ...block,
    value: event.id,
  }

  store.updatePageContent(updated)
};

const allowedTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'text'];

const editableTags = computed(() => {
  if (allowedTags.includes(block.type as typeof allowedTags[number])) {
    return block.type === 'text' ? 'p' : block.type;
  }

  return null
});

// для смены тега
const textItems = [
  {
    label: 'H1',
    onSelect: () => updateContentBlock(undefined, 'h1')
  },
  {
    label: 'H2',
    onSelect: () => updateContentBlock(undefined, 'h2')
  },
  {
    label: 'H3',
    onSelect: () => updateContentBlock(undefined, 'h3')
  }, {
    label: 'H4',
    onSelect: () => updateContentBlock(undefined, 'h4')
  }, {
    label: 'H5',
    onSelect: () => updateContentBlock(undefined, 'h5')
  }, {
    label: 'H6',
    onSelect: () => updateContentBlock(undefined, 'h6')
  }, {
    label: 'text',
    onSelect: () => updateContentBlock(undefined, 'text')
  },
]

const isMobile = useIsMobile()
const selectedTextType = ref(textItems.find(el => el.label.toLowerCase() === block.type)?.label)

</script>

<template>
  <div @mouseenter="isHover = true" @mouseleave="isHover = false" class="flex items-center relative gap-2 max-w-full">

    <!--  меню слева  -->
    <div v-if="!isMobile" :class="isHover ? 'opacity-100' : 'opacity-0'" class="flex gap-2 w-18">
      <DropDown :items="addItems" icon="material-symbols:add-2"/>
      <DropDown :items="optionItems" class="drag-handle" icon="teenyicons:drag-vertical-solid"/>
    </div>

    <UModal title="edit" v-model:open="isOpenModal">
      <template #body>
        <UInput :value="block.value" class="w-full" @blur="updateContentBlock"/>
        <USelect :items="textItems" value-key="label" v-model="selectedTextType" class="w-full"/>
      </template>
    </UModal>

    <!--  текстовые блоки h1 - p  -->
    <component
        :id="`block-${block.id}`"
        @keydown.enter.shift.prevent="createContentBlock('text')"
        @keydown="deleteOnBackspace"
        @input="$emit('empty', $event)"
        placeholder="Type anything"
        @blur="edit"
        contenteditable="true"
        v-if="editableTags"
        :is="editableTags">{{ block.value }}
    </component>


    <!--  картинка  -->
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

    <!--  ютуб  -->
    <div v-if="block.type === 'youtube'" class="mt-2 relative w-96">
      <div>
        <iframe id="inlineFrameExample"
                v-if="block.value"
                title="Inline Frame Example"
                :src="block.value"></iframe>
      </div>

      <UModal title="Update image link">
        <UButton icon="material-symbols:edit-outline-rounded" variant="subtle" class="absolute top-5 right-5"
                 v-if="block.value"/>
        <template #body>
          <UInput :value="block.value" class="w-full" @blur="updateContentBlock"/>
        </template>
      </UModal>

      <input :id="`block-${block.id}`"
             class="w-full"
             v-if="!block.value"
             placeholder="Link to youtube"
             @keydown.enter="updateContentBlock"
             @keydown.esc="store.deleteContentBlock(block.id)"
             @blur="updateContentBlock"/>
    </div>


    <!--  ссылка  -->
    <div class="flex gap-2 w-full items-center relative"
         v-if="block.type==='link'">
      <a target="_blank"
         class="block link"
         :id="`block-${block.id}`"
         :href="getHttpLink(block.value)"
         v-if="block.value"
      >
        {{ block.value }}
      </a>

      <input :id="`block-${block.id}`"
             v-if="!block.value"
             placeholder="Link"
             @keydown.enter="updateContentBlock"
             @keydown.esc="store.deleteContentBlock(block.id)"
             @blur="updateContentBlock"/>

    </div>

    <!--  страница  -->
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

    <!--  таблица  -->
    <client-only>
      <ContentTable v-if="block.type==='table'" :data="block.value" @update="updateTableBlock"/>
    </client-only>

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
  @media (max-width: 520px) {
    width: auto;
    height: auto;
  }
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

@media (max-width: 1023px) {
  h1 {
    font-size: 32px;
  }

  h2 {
    font-size: 30px;
  }

  h3 {
    font-size: 24px;
  }

  h4 {
    font-size: 20px;
  }

  h5 {
    font-size: 17px;
  }

  h6 {
    font-size: 15px;
  }

  p {
    font-size: 15px;
  }
}

@media (max-width: 640px) {
  h1 {
    font-size: 26px;
  }

  h2 {
    font-size: 24px;
  }

  h3 {
    font-size: 20px;
  }

  h4 {
    font-size: 18px;
  }

  h5 {
    font-size: 16px;
  }

  h6 {
    font-size: 15px;
  }

  p {
    font-size: 14px;
  }
}

a.link {
  text-decoration: underline;
  color: #2563eb;
}
</style>
