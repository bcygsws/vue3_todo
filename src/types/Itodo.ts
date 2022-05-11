export interface Itodo {
  id: number;
  title: string;
  // mysql数据库中，没有布尔类型；在图像化界面中，声明tinyint类型，1表示true,0表示false，注意单独的转换
  isCompleted: boolean;
}
