import { Itodo } from '../types/Itodo';
// 将数组序列化，然后存入本地缓存
export function saveTodos(todos: Itodo[]) {
  localStorage.setItem('todos_key', JSON.stringify(todos));
}
// 将数组从缓存中读取出来
export function getTodos(): Itodo[] {
  return JSON.parse(localStorage.getItem('todos_key') || '[]');
}
