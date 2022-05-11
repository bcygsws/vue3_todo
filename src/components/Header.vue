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
        // 调用父组件App的addItem方法，数组库操作时，id自增，添加数据时，id可省
        // id: Date.now() + Math.random() * 100,
        title: title.value,
        // 0代表false
        isCompleted: 0
      };
      console.log(todo);
      // vue的单向数据流：父组件向子组件传值，子组件本身不能修改它，需要借助emit父组件的方法来修改，然后这种变化从父组件流向子组件
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
    /* 将文本框获取焦点时，默认的黑框轮廓去掉 */
    outline: none;
    border-color: rgba(82, 168, 236, 0.8);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
      0 0 8px rgba(82, 168, 236, 0.6);
  }
}
</style>
