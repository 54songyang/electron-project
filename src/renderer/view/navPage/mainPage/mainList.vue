<template>
  <div>
    <slot v-for="item in myArray" :name="item.id"></slot>
  </div>
</template>

<script>
export default {
  name:'mainList',
  props:["myArray"],
};
</script>

<style>
</style>