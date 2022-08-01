---
layout:     post
title:      "Vue3.2 setup常见语法糖"
subtitle:   "Vue3常见语法糖（js&ts）"
date:       2022-03-14
author:     "Peyton"
header-img: "img/post-bg-ios9-web.jpg"
category: demo
tags:
    - Web
    - Vue3
    - 语法糖
---

个人感觉这种语法更接近js原生的写法。更少的样板内容，更简洁的代码。
<!-- more -->


### 1.why熟悉setup语法糖

- 从3.2版本正式上线后，setup在script标签中使用，从实验性语法正式上线。
组件只需引入不用注册，属性和方法也不用返回，也不用写setup函数，也不用写export default。个人感觉这种语法更接近js原生的写法。更少的样板内容，更简洁的代码。

当使用 `<script setup>` 的时候，任何在 `<script setup>` 声明的顶层的绑定 (包括变量，函数声明，以及 import 引入的内容) 都能在模板中直接使用：
```
<script setup>
// 变量
const msg = 'Hello!'

// 函数
function log() {
  console.log(msg)
}
</script>

<template>
  <div @click="log">{{ msg }}</div>
</template>
```

import 导入的内容也会以同样的方式暴露。意味着可以在模板表达式中直接使用导入的 helper 函数，并不需要通过 `methods` 选项来暴露它：
```
<script setup>
import { capitalize } from './helpers'
</script>

<template>
  <div>{{ capitalize('hello') }}</div>
</template>
```

响应式状态需要明确使用响应式 API来创建。和从 `setup()` 函数中返回值一样，ref 值在模板中使用的时候会自动解包：

```
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```
### 2.setup在组件中的使用
- `<script setup>` 范围里的值也能被直接作为自定义组件的标签名使用，引入的组件可以直接使用，无需再通过components进行注册
```
<script setup>
import MyComponent from './MyComponent.vue'
</script>

<template>
  <MyComponent />
</template>
```

### 3.setup新增api

#### `defineProps` 和 `defineEmits`

在 `<script setup>` 中必须使用 `defineProps` 和 `defineEmits` API 来声明 `props` 和 `emits` ，它们具备完整的类型推断并且在 `<script setup>` 中是直接可用的：
```
<script setup>
const props = defineProps({
  foo: String
})

const emit = defineEmits(['change', 'delete'])
// setup code
</script>
```
#### `defineExpose`
组件暴露出自己的属性，当父组件通过模板 ref 的方式获取到当前组件的实例，获取到的实例会像这样 `{ a: number, b: number }` (ref 会和在普通实例中一样被自动解包)

```
<script setup>
import { ref } from 'vue'

const a = 1
const b = ref(2)

defineExpose({
  a,
  b
})
</script>
```

### 4.setup在ts中的使用

#### TypeScript中使用props/emit
props 和 emits 都可以使用传递字面量类型的纯类型语法做为参数给 `defineProps` 和 `defineEmits`来声明：

```
const props = defineProps<{
  foo: string
  bar?: number
}>()

const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
```

#### 使用类型声明时的默认 props 值

仅限类型的 `defineProps` 声明的不足之处在于，它没有可以给 props 提供默认值的方式。为了解决这个问题，提供了 `withDefaults` 编译器宏：

```
interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  labels: () => ['one', 'two']
})
```

### 总结
#### 个人感觉这种语法更接近js原生的写法。更少的样板内容，更简洁的代码。
















