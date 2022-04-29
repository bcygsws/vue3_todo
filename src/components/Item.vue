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
    <button class="btn btn-danger" :style="{ display: isShow }">删除</button>
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
    todo: Object as () => Itodo // 函数的返回类型是Itodo，将Object对象断言为了Itodo
  },
  setup() {
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
    return {
      handleMouse,
      bgColor,
      myColor,
      isShow
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
