<script setup lang="ts">

const store = useFileStore()

</script>

<template>
  <div>
    <SidebarFileTree :nodes="store.fileTree" v-if="store.fileTree" :parent-id="null" />
  </div>
</template>

<style scoped>

</style>