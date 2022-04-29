<template>
  <div class="todo-header">
    <input
      type="text"
      placeholder="请输入你的任务名称，按回车键确认"
      v-model="title"
      @keyup.enter="add"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  name: 'Header',
  props: {
    addItem: {
      type: Function,
      required: true // 必须传入
    }
  },
  setup(props) {
    // 定义文本框内的值为一个ref
    const title = ref('');
    // enter键回车的事件处理函数中，要对title.value的值进行判断
    const add = () => {
      // 如果title是空的，直接返回
      if (!title.value.trim()) return;
      // title有值，组织成一个对象，传给addItem方法
      const todo = {
        // 调用父组件App的addItem方法
        id: Date.now() + Math.random() * 100,
        title: title.value,
        isCompleted: false
      };
      console.log(todo);
      props.addItem(todo);
      // 数据添加完成，清空文本框
      title.value = '';
    };

    return { add, title };
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
/*header*/
.todo-header input {
  width: 560px;
  height: 28px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px 7px;
  &:focus {
    outline: none;
    border-color: rgba(82, 168, 236, 0.8);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
      0 0 8px rgba(82, 168, 236, 0.6);
  }
}
</style>
