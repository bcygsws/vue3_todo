<template>
  <div class="todo-container">
    <div class="todo-wrap">
      <!-- addItem添加一条数据，在Header组件中，触发App组件中的addItem方法 -->
      <Header :addItem="addItem"></Header>
      <List
        :todos="todos"
        :deleteData="deleteData"
        :toggleSelect="toggleSelect"
      ></List>
      <Footer></Footer>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import Header from './components/Header.vue';
import List from './components/List.vue';
import Footer from './components/Footer.vue';
// 引入接口
import { Itodo } from './types/Itodo';

/**
 *
 * @ 分析
 * 1.Header List Footer和Item组件之间的关系很清楚，从App到Item最多孙子级组件，可以直接将数据定义在App组件中，供给子孙组件使用
 * 2.自定义一些数据，将数据渲染到列表中
 * 3.数据结构使用对象数据，对象是每个条目的信息：包含id,title,是否选中isCompleted
 *
 */

export default defineComponent({
  name: 'App',
  setup() {
    // 定义数据
    // 数据不允许添加其他属性，使用泛型约束
    const state = reactive<{ todos: Itodo[] }>({
      todos: [
        { id: 1, title: '宝马', isCompleted: true },
        { id: 2, title: '奥迪', isCompleted: false },
        { id: 3, title: '劳斯莱斯', isCompleted: true }
      ]
    });
    // 操作一；在数组的最前面添加有一个todo对象
    const addItem = (todo: Itodo) => {
      // reactive对象，直接对象.键名读取键值，这里键值是数组
      state.todos.unshift(todo);
    };
    // 操作二、从数组中删除某一项，传入该项的索引，splice方法，从数组中删除元素
    const deleteData = (id: number) => {
      // 根据传入的id,找该条数据对象，在数组中的索引值，some方法
      state.todos.some((item, index) => {
        if (item.id === id) {
          state.todos.splice(index, 1);
          return true;
        }
      });
    };
    // 操作三、切换选中状态
    const toggleSelect = (todo: Itodo, isSelected: boolean) => {
      state.todos.some((item, index) => {
        if (todo.id === item.id) {
          state.todos[index].isCompleted = isSelected;
          console.log(state.todos);
          return true;
        }
      });
    };
    return {
      // 模板中可以直接使用todos数组了
      ...toRefs(state),
      addItem,
      deleteData,
      toggleSelect
    };
  },
  components: {
    Header,
    List,
    Footer
  }
});
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
/*app*/
.todo-container {
  width: 600px;
  margin: 0 auto;
  .todo-wrap {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
}
</style>
