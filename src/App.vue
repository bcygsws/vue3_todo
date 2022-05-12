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
      <!-- Footer中的复选框控制全选或者全不选时，可以通过arrLength和selLength是否相等，来确定isAll计算属性的get方法返回值 -->
      <!-- <Footer :len="len" :todos="todos" :deleteItems="deleteItems" :checkAll="checkAll"></Footer> -->
      <Footer
        :len="len"
        :deleteItems="deleteItems"
        :checkAll="checkAll"
      ></Footer>
    </div>
  </div>
</template>

<script lang="ts">
// import { defineComponent, reactive, toRefs, watch } from 'vue';
import { defineComponent, reactive, toRefs, watchEffect, watch } from 'vue';
import Header from './components/Header.vue';
import List from './components/List.vue';
import Footer from './components/Footer.vue';
// 引入接口
import { Itodo } from './types/Itodo';
// 引入读、写本地缓存的方法
// import { saveTodos, getTodos } from './utils/storageUtils';
// 引入自定义钩子，requests.ts;操作数据库
// import { getRequest } from './utils/requests';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:3001/';
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
      // todos: [
      //   { id: 1, title: '宝马', isCompleted: true },
      //   { id: 2, title: '奥迪', isCompleted: false },
      //   { id: 3, title: '劳斯莱斯', isCompleted: true }
      // ]
      // 默认是个空数组[]，数据完全实现和本地缓存的读写
      todos: []
    });
    // setup在beforeCreated和created之前执行，在setup中写的代码，相当于在created阶段完成数据初始化
    // 一、采用本地缓存localStorage
    // state.todos = getTodos();
    // 二、使用数据库里的数据,自定义钩子
    const getTodos = () => {
      axios.get('todos').then((res) => {
        // map和forEach的区别在于元素执行回调后，前者返回值是改变后的新数组，而forEach返回undefined
        let arr1: Itodo[] = [];
        if (res.status === 200) {
          res.data.map((item: Itodo) => {
            item.isCompleted = item.isCompleted ? true : false;
            // 使用unshift保证增加记录时，数据按照id从大到小渲染
            arr1.unshift(item);
          });
          state.todos = arr1;
        }
      });
    };
    getTodos();
    console.log(state.todos);
    // axios.get('http://localhost:3001/todos').then((res) => {
    //   state.todos = res.data;
    //   console.log(state.todos);
    // });
    // console.log(state.todos); // 空Proxy对象，原因是：请求后台数据是异步过程
    // 先检查本地的localStorage中有没有数据，无数据，使用state就可以；有数据把从本地读取的数据赋给state
    // 多处有改变数组的任何内容的地方，都需要更新本地缓存的数据，将保存和读取缓存的操作封装，自定义hook
    // 操作一；在数组的最前面添加有一个todo对象
    const addItem = (todo: Itodo) => {
      // reactive对象，直接对象.键名读取键值，这里键值是数组
      state.todos.unshift(todo);
      axios.post('todos/todo', todo).then((res) => {
        console.log(res);
        if (res.data.code === 200) {
          console.log(res.data.msg);
          getTodos();
        }
      });
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
      // 从数据库中删除该id对应的记录
      axios.delete(`todos/todo/${id}`).then((res) => {
        if (res.data.code === 200) {
          console.log(res);
        }
      });
    };
    // 操作三、切换选中状态
    const toggleSelect = (todo: Itodo, isSelected: boolean) => {
      console.log(todo);
      state.todos.some((item, index) => {
        if (todo.id === item.id) {
          state.todos[index].isCompleted = isSelected;
          console.log(state.todos);
          return true;
        }
      });
      axios.put(`todos/todo/${todo.id}/${isSelected ? 1 : 0}`).then((res) => {
        if (res.data.code === 200) {
          console.log('成功更改一条记录');
        }
      });
    };
    // 操作四、监听数组的长度arrLength和选中状态的条目数量selLength
    const len = reactive({
      arrLength: 0,
      selLength: 0
    });
    // watch(state.todos, (val: Itodo[]) => {
    //   len.arrLength = val.length;
    //   const arr = val.filter((item) => {
    //     return item.isCompleted === true;
    //   });
    //   len.selLength = arr.length;
    // });
    // 1.让它初始的时候，执行一次，可以使用第三参数，watch的两个特性，immediate:true
    // 2.也可以使用watchEffect，watchEffect默认执行一次，收集数据依赖；默认有哪些响应式数据，就监视这些数据
    // watch(
    //   state.todos,(val: Itodo[]) => {
    //     len.arrLength = val.length;
    //     const arr = val.filter((item) => {
    //       return item.isCompleted === true;
    //     });
    //     len.selLength = arr.length;
    //   },
    //   {
    //     immediate: true
    //   }
    // );
    watchEffect(() => {
      len.arrLength = state.todos.length;
      const arr = state.todos.filter((item) => {
        return item.isCompleted === true;
      });
      len.selLength = arr.length;
    });
    // 操作五、Footer中复选框，全选中和全不选中的切换
    const checkAll = (val: boolean) => {
      state.todos.map((item) => {
        item.isCompleted = val;
      });
      // 更改提交到数据库
      axios.put(`todos/${val ? 1 : 0}`).then((res) => {
        if (res.data.code === 200) {
          console.log(val ? '所有复选框选中' : '所有复选框都取消');
        }
      });
    };
    // 操作六、点击按钮【清除已完成任务】，删除那些被选中的条目
    const deleteItems = () => {
      // 过滤后，保留那些未被选中的条目
      state.todos = state.todos.filter((item: Itodo) => {
        return item.isCompleted === false;
      });
      console.log(state.todos);
      // data是固定写法，{data:state.todos},后端直接req.body获取state.todos这个数组
      /**
       * 
       * @ 区别
       * axios的delete传参和post put传参方式不同
       * a.post put请求方式，有三个参数，url,data,config
       * b.然而，delete请求方式，只有两个参数，url,config，data在config中，data是config的一个属性
       * axios.delete(url,{data:传递的参数})，第二个参数相当于将config解构
       * 
       */
      axios.delete('todos', { data: state.todos }).then((res) => {
        if (res.data.code === 200) {
          console.log('删除选中的记录成功');
        }
      });
      // saveTodos(noSelected);
      // state.todos = noSelected;
      // saveTodos(state.todos);
    };
    // 操作七、数据持久化
    // 使用watch的两个特性，原因是:state.todos变化可能是深层次的数据，初始执行一次
    // 测试数据监听是否成功
        /**
         *
         * Bug分析
         * 1.【清除完成任务】按钮点击时，这个watch监听执行了：但是val中保存的还是过滤器返回数组noSelected赋值前的
         * state.todos
         * 2.watch中saveTodos在语句state.todos=noSelected语句之前执行了，导致删【清除完成任务】
         * 这个按钮，虽然删除了数据，界面更新；但是，当重新刷新页面时，界面还是按钮点击前的状态
         *
         * 解决方案：在deleteItems中增加存储数据，saveTodos(noSelected); state.todos=noSelected;语句
         *
         * vue3面试
         * 1.vue3中包含了vue2中绝大部分特性，在2020年9月份发布了第1个正式版
         * 2.vue3 提供了一套强大的组合API-composition API代替vue2中的options API
         * 3.最重要：vue3使用代理的方式处理响应式数据(Proxy和Reflect),vue2中使用的是Object.defineProperty(data,'count',{
         *    get(),
         *    set()
         * })
         * 的方式处理响应式数据，vue2的缺陷在于：
         * a.添加和删除属性不会更新界面
         * b.改变数组的长度或者用下标的方式更改数组元素值，不会触发响应式
         *
         * 4.vue3能够更好的兼容ts,vue3的源码是用ts写的
         *
         * 5.vue3中提供了一种新的web构建方式-Vite,他是基于ESM原生驱动的
         *
         * 6.重写了虚拟dom
         * 量化指标：打包体积减少41%，初始渲染快了55%，更新渲染快了133%，占用内存减少了54%
         *
         * 7.提供了一些新的组件
         * Fragment 片段 Teleport 瞬移组件
         * Suspense 不确定，后备内容组件
         *
         * 8.编码更加清晰、美观，在vue2中如果更改一个需求，需要在data,methods,和computed中修改，滚动条必须上下移动；而vue3中使用组合API,将
         * 代码以块的形式书写，编码更加清晰
         *
         *
         *
         */
    // watch(
    //   state.todos,
    //   (val) => {
    //     console.log('数据监听了---', val);
    //     // saveTodos(val);
    //   },
    //   {
    //     immediate: true,
    //     deep: true
    //   }
    // );
    return {
      // 模板中可以直接使用todos数组了
      ...toRefs(state),
      addItem,
      deleteData,
      toggleSelect,
      deleteItems,
      len,
      checkAll
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
