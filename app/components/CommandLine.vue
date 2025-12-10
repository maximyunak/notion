<script setup lang="ts">

import type {BlockType, ContentBlock} from "~/types/PageContent";
import type {DropDownItem} from "~/types/DropDown";

const emit = defineEmits<{
  (e: 'empty', event: Event): void,
  (e: 'create', block: ContentBlock, prevBlockId?: string, isFocus?: boolean): void,
}>();

const isHover = ref(false)
const isFocus = ref(false)
const isCommand = ref(false)
const activeSlot = ref<number>(0)
const value = ref('')
const editorRef = ref<HTMLElement | null>(null)

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

const createContentBlock = (type: BlockType = 'text', value: string = '', isFocus: boolean = true) => {
  const newBlock = {
    type: type,
    id: Math.random().toString(36).substr(7),
    value,
  } as ContentBlock
  if (type === 'table') {
    newBlock.value = [
      ['Header1', 'Header2'],
      ['', ''],
    ]
  }
  emit("create", newBlock, undefined, isFocus);
};

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

const onKeyDown = (e: KeyboardEvent): void => {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (activeSlot.value < addItems.value.length - 1) activeSlot.value++
  }
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (activeSlot.value > 0) activeSlot.value--;
  }

  if (e.key === 'Enter' && isCommand.value) {
    e.preventDefault()
    createAndReset(addItems.value[activeSlot.value]?.label.toLowerCase() as BlockType)
  }
}

const onGlobalKeyDown = (e: KeyboardEvent): void => {
  if (
      document.activeElement?.isContentEditable ||
      ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName || '')
  ) {
    return
  }
  if (e.code === 'Slash') {
    e.preventDefault()
    nextTick(() => {
      const el = editorRef.value

      if (!el) return

      el.focus()

      document.execCommand('insertText', false, '/')
    })

    isCommand.value = true
  }
}

const onBlur = (e: Event) => {
  isFocus.value = false
  const target = e.target as HTMLElement;
  const text = target.innerText.trim();

  if (text !== '' && !isCommand.value) {
    createContentBlock("text", text, false)
  }

  target.innerText = ''
  value.value = ''
  isCommand.value = false
}

const createAndReset = (type: BlockType, val: string = '') => {
  createContentBlock(type, val)
  const el = editorRef.value
  if (!el) return
  value.value = ''
  isCommand.value = false
  activeSlot.value = 0
  el.innerText = ''
  el.blur()
}

onMounted(() => {
  document.addEventListener('keydown', onGlobalKeyDown)
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onGlobalKeyDown)
})
</script>

<template>
  <div
      @mouseenter="isHover = true"
      @keydown="onKeyDown"
      @mouseleave="isHover = false"
      class="relative opacity-0 transition-opacity mb-96"
      :class="{
        'opacity-100': isHover || value || isFocus,
      }"
  >

    <Transition>
      <div v-if="isCommand" class="absolute top-7 z-50 shadow-lg bg-muted rounded-sm"
      >
        <div
            @mouseenter="activeSlot=idx"
            @click="onCreate(item)"
            v-for="(item,idx) in addItems"
            class="px-3 cursor-pointer py-1 my-1 transition-colors flex gap-2 items-center"
            :class="{
               'bg-accented': activeSlot === idx,
             }"
        >
          {{ item.label }}
        </div>
      </div>
    </Transition>

    <p id="command"
       ref="editorRef"
       class="w-full"
       @input="onInput"
       @focus="isFocus=true"
       @blur="onBlur"
       type="text"
       contenteditable="true"
       placeholder="Write, / for commands">{{ value }}</p>

  </div>
</template>

<style scoped>

</style>