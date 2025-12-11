<script setup lang="ts">

</script>

<template>
  <div class="flex w-screen">

    <UApp>
      <Sidebar/>
      <main class="w-full lg:ml-[30%] mt-20">
        <div class="px-10 sm:px-10 w-full h-full">
          <slot/>
        </div>
      </main>


    </UApp>
  </div>

</template>

<style>
</style>