<template>
  <!-- mouseenter和mouseleave事件，来控制进入li和离开li的背景 -->
  <li
    @mouseenter="handleMouse(true)"
    @mouseleave="handleMouse(false)"
    :style="{ backgroundColor: bgColor, color: myColor }"
  >
    <label>
      <input type="checkbox" :checked="todo.isCompleted" />
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
import { defineComponent, ref } from 'vue';
// 引入接口
export default defineComponent({
  name: 'Item',
  props: {
    todo: Object as () => Itodo, // 函数的返回类型是Itodo，将Object对象断言为了Itodo
    deleteData: {
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
    return {
      handleMouse,
      bgColor,
      myColor,
      isShow,
      deleteOne
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
