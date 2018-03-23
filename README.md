# vue 自定义指令————拖动排序组件
	
---
	table拖动排序,数据源必须为list！！！
	list中的每条数据应有唯一的id和权重(weight)
---

## 用法
	1.在父组件引入moveSort

```
	import moveSort from 'moveSort'
```
2.在table绑定自定义指令v-moveSort,返回函数
```
	<table v-moveSort="moveSort"></table>
```
3.在tr中绑定data-id,data-weight
```
	<tr v-for(item,index) in list :data-id="item.id" :data-weight="item.weight"></tr>
```
