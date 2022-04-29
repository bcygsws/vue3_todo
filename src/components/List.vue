<template>
  <ul class="todo-main">
    <Item :todo="item" v-for="item in todos" :key="item.id" :deleteData="deleteData"></Item>
  </ul>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
// 导入列表项组件Item
import Item from './Item.vue';
export default defineComponent({
  name: 'List',
  components: {
    Item
  },
  // 接收父组件传递过来的todos数据
  props: ['todos','deleteData']
});
</script>
<style scoped lang="less">
/*main*/
.todo-main {
  margin-left: 0px;
  border: 1px solid #ddd;
  border-radius: 2px;
  padding: 0px;
}

.todo-empty {
  height: 40px;
  line-height: 40px;
  border: 1px solid #ddd;
  border-radius: 2px;
  padding-left: 5px;
  margin-top: 10px;
}
</style>
