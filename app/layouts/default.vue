<script setup lang="ts">

</script>

<template>
  <div class="flex">

    <UApp>
      <Sidebar/>
      <main>
        <div class="px-15">
          <slot/>
        </div>
      </main>


    </UApp>
  </div>

</template>

<style>
</style>