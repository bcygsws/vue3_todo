<template>
  <div class="todo-footer">
    <label>
      <!-- 1.注意：初始化状态时，复选框被选中的唯一条件是，所有条目的isCompleted为true
      同时，可以手动更改选中与否；当【取消勾选】时，所有条目上的【选中】状态都被取消，所有条目isComputed都是false
      2.因此，适合用getter/setter的计算属性computed -->
      <input type="checkbox" v-model="isAll" />
    </label>
    <span>
      <span>已完成{{ selLength }}</span> / 全部{{ arrLength }}
    </span>
    <button class="btn btn-danger" @click="clearSelect">清除已完成任务</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
// 引入接口
import { Itodo } from '../types/Itodo';
export default defineComponent({
  name: 'Footer',
  props: {
    len: {
      type: Object as () => {
        selLength: number;
        arrLength: number;
      },
      required: true
    },
    todos: {
      type: Array as () => Itodo[],
      required: true
    },
    deleteItems: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    const isAll = computed({
      get() {
        return props.todos.every((item) => {
          return item.isCompleted === true;
        });
      },
      set(val: boolean) {
        // 要操作App中的数组todos,由于Footer和App是子组件和父组件的关系，可以直接将todos传递过来，使用props.todos拿到数组
        props.todos.map((item) => {
          item.isCompleted = val;
        });
      }
    });
    // 将那些勾选的
    const clearSelect = () => {
      props.deleteItems();
    };
    // 清除已经选中的
    return {
      ...toRefs(props.len),
      isAll,
      clearSelect
    };
  }
});
</script>
<style scoped lang="less">
/*footer*/
.todo-footer {
  height: 40px;
  line-height: 40px;
  padding-left: 6px;
  margin-top: 5px;
  label {
    display: inline-block;
    margin-right: 20px;
    cursor: pointer;
    input {
      position: relative;
      top: -1px;
      vertical-align: middle;
      margin-right: 5px;
    }
  }
  button {
    float: right;
    margin-top: 5px;
  }
}
</style>
