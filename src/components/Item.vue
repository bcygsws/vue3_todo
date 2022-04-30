<template>
  <!-- mouseenter和mouseleave事件，来控制进入li和离开li的背景 -->
  <li
    @mouseenter="handleMouse(true)"
    @mouseleave="handleMouse(false)"
    :style="{ backgroundColor: bgColor, color: myColor }"
  >
    <label>
      <!-- 1.checked只是根据数组中的值true和false,渲染出复选框的选中或者未选中状态，并没有直接更改isCompleted的值
      为此，我们需要使用计算和监听：当isCompleted的值，改变时，立即拿到最新的isCompleted值
      2.checkbox也有v-model里面的值，是控制复选框的选中或未选中的 -->
      <input type="checkbox" v-model="isSelected" />
      <span>{{ todo.title }}</span>
    </label>
    <button
      class="btn btn-danger"
      :style="{ display: isShow }"
      @click="deleteOne(todo.id)"
    >
      删除
    </button>
  </li>
</template>

<script lang="ts">
// 引入井口
import { Itodo } from '../types/Itodo';
import { defineComponent, ref, computed } from 'vue';
// 引入接口
export default defineComponent({
  name: 'Item',
  props: {
    todo: {
      type: Object as () => Itodo,
      required: true
    }, // 函数的返回类型是Itodo，将Object对象断言为了Itodo
    deleteData: {
      type: Function,
      required: true
    },
    toggleSelect: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    const bgColor = ref('white');
    const myColor = ref('black');
    const isShow = ref('none');
    const handleMouse = (flag: boolean) => {
      if (flag) {
        // 当然也可以使用原生对象，obj.classList.add() /remove()
        // 鼠标进入li的事件
        bgColor.value = 'pink';
        myColor.value = 'green';
        isShow.value = 'block';
      } else {
        // 鼠标离开li的事件
        bgColor.value = 'white';
        myColor.value = 'black';
        isShow.value = 'none';
      }
    };
    // 删除按钮的事件处理函数,id也可以从setup的参数props中拿到
    console.log(props);
    const deleteOne = (id: number) => {
      // 通过id在数组中寻找，该id所在对象 在数组中的索引位置
      // 可以使用对话框判断
      // confirm是确定/取消对话框，点击确定按钮后，值为true；点击取消值为false
      if (window.confirm('确定删除吗？')) {
        props.deleteData(id);
      }
    };
    console.log(props.todo);
    const isSelected = computed({
      get() {
        return props.todo.isCompleted;
      },
      set(val: boolean) {
        // todo是从App组件中的todos数组，传递给孙子组件Item中，Item本身是没有权限更改这个数据的，需要调用App中定义的方法来
        // 改变这个值
        // props.todo.isCompleted = val; // Error
        props.toggleSelect(props.todo, val);
      }
    });
    return {
      handleMouse,
      bgColor,
      myColor,
      isShow,
      deleteOne,
      isSelected
    };
  }
});
</script>
<style scoped lang="less">
li {
  list-style: none;
  height: 36px;
  line-height: 36px;
  padding: 0 5px;
  border-bottom: 1px solid #ddd;
}

li label {
  float: left;
  cursor: pointer;
}

li label li input {
  vertical-align: middle;
  margin-right: 6px;
  position: relative;
  top: -1px;
}

li button {
  float: right;
  display: none;
  margin-top: 3px;
}

li:before {
  content: initial;
}

li:last-child {
  border-bottom: none;
}
</style>
