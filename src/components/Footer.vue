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
    // todos: {
    //   type: Array as () => Itodo[],
    //   required: true
    // },
    checkAll: {
      type: Function,
      required: true
    },
    deleteItems: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    const isAll = computed({
      // get处理列表中的各条目影响Footer中复选框的选中或者取消
      get() {
        // 方法一
        // return props.todos.every((item) => {
        //   return item.isCompleted === true;
        // });
        // 方法二
        return props.len.arrLength === props.len.selLength ? true : false;
      },
      // set处理手动【选中】或者【取消】影响各条目的全选中或者全取消
      set(val: boolean) {
        // 要操作App中的数组todos,由于Footer和App是子组件和父组件的关系，可以直接将todos传递过来，使用props.todos拿到数组
        // props.todos是父组件APP传递过来的，这里改变数组值，App中watch能监听到todos的变化
        // props.todos.map((item) => {
        //   item.isCompleted = val;
        // });
        props.checkAll(val);
      }
    });
    // 按钮【清除已完成任务】的事件处理-click事件
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
