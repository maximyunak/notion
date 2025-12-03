<script setup lang="ts">

import type {FlatTreeNode, PageContent} from "~/types/TreeNode";

const store = useFileStore();

const pageData = ref<{
  page: FlatTreeNode,
  content: PageContent
}>();

const route = useRoute();

pageData.value = await store.getPageContent(route.params.id as string)
</script>

<template>
  <div class="mx-auto">
    <h1>{{ pageData?.page.label}}</h1>
    <div>{{ pageData?.content.content }}</div>
  </div>
</template>

<style scoped>

</style>