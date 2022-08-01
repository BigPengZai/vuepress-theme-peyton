---
layout:     post
title:      "小程序中封装高阶组件"
subtitle:   "search"
date:       2022-07-03
author:     "Peyton"
header-img: "img/post-bg-ios9-web.jpg"
category: demo
tags:
    - Web
    - 小程序
    - 组件
---

本次带来的是一个`search`组件的封装
<!-- more -->


#### 功能预览

本次带来的是一个`search`组件的封装，源码已经上传到github文章结尾处自行采摘，数据源来自[github-searchRepos](https://docs.github.com/en/rest/search#search-repositories)。

功能简介

包含的功能模块：历史搜索、热门搜索、input搜索、分页数据加载等

包含的技术点：自定义组件、`request`的封装、`behaviors`、`observer`、`slot` 等



![search.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c7f897cbfb549b9a41e282c4c2e62f9~tplv-k3u1fbpfcp-watermark.image?)

#### 组件的理解

-   处理大量的业务逻辑
-   处理组件与page界面 各种数据交互
-   具有复用性、低耦合，将复杂的页面拆分成多个低耦合的模块，有助于代码维护。

#### 组件规范

0.  组件化的意义更多的是业务分离，代码的分离。不仅仅是复用，将复杂的页面拆分成更多的是低耦合模块。[自定义组件](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/)

0.  组件命名规范（不一定要一致，每个团队协定一致即可）

    0.  以 `-cmp` 后缀命名

    ```
    {
       "usingComponents":{
           "love-cmp":"../../components/love/**"
      }
    }
    ```

    2.  引用组件 可以使用绝对路径 ”/components/search/search“
    2.  与组件相关的图片 建议images文件 放入到组件下面，跟目录的images文件夹放与pages相关的图片

0.  配置项 config.js

0.  Behavior 组件公用 行为，面向对象 继承的思想.(js 代码公用)

#### 封装组件

##### search组件

-   0、顶部搜索区域，这里主要处理cancle的动作。

使用抛出事件的方式`trigger`提高组件的扩展性。

有可能会出现其他的交互，设计组件的时候，把决定权交给外部。

```
//cancle事件，向外部发出一个通知。由使用者在各个page界面中处理不同的业务逻辑
onCancle(e) {
    this.triggerEvent('cancle', {}, {})
}
```

-   1、历史搜索中将业务逻辑的代码封装到一个models中。

将业务逻辑放入到models中，这里有三种方案。

1、searchModels 直接写入到 search组件中，说明这个models仅仅是给search组件使用的

2、各个组件都需要使用的时候，可以放入到components -models，整个组件都可以复用的模块。

3、根目录下面，可能是给整个项目使用。取决于思路。

Ps:项目建议都放入根目录下面。 给外部使用的时候使用方式二。

```
//在searchModels中封装三个函数
//getHistory 将关键字 写入到缓存中
getHistory(){
 const words = wx.getStorageSync(this.key)
  if(!words){
        return []
    }
   return words
 }
//getHot这里我们简单mock一些数据，不是重点。
getHot(){
        let hotWords = ['JavaScript','Python','Java','PHP','CSS','C#','C++','TypeScript','Ruby','C','Swift']
        return hotWords
}
​
//addToHistory这里有一些简单的，数据结构队列的应用
 addToHistory(keyword){
     let words = this.getHistory()
     const has = words.includes(keyword)
     // 队列栈
     if(!has){
         const length = words.length
         // 数组末尾 删除 ， keyword 数组第一位
         if(length >= this.maxLength){
             words.pop()
         }
         words.unshift(keyword)
         wx.setStorageSync(this.key, words)
     }
}
```

-   2.热门搜索与历史搜索的标签比较一致，这里我们再次封装一个tag组件

##### tag组件

1、提高更多的拓展性，设计多个slot以便更多的业务场景的需要。

这里在设计tag组件的时候，通过slot预留使用场景。比如：其他的业务场景不光光是需要展示text，有尾部数值的展示等。
默认情况下，一个组件的 wxml 中只能有一个 slot 。需要使用多 slot 时，可以在组件 js 中声明启用。
```
<view class="container tag-class " bind:tap="onTap">
   <slot class="before"></slot>
   <text>{{text}}</text>
   <slot class="after"></slot>
</view>
​
```

2、提供外部样式类，tag组件的样式交给外部使用者来决定样式。

```
 /**
  * 组件的属性列表
  */
 options:{
   multipleSlots:true
},
 externalClasses:["tag-class"],
 properties: {
     text:String
},
​
```

##### 分页加载的实现逻辑

这里有两种方案的实现

-   通过page界面的onReachBottom函数
-   通过 scrollview的方案

我们这里通过page界面的onReachBottom函数，因为search是一个Component，不会触发底部的onReachBottom函数，所以这里我们使用 properties 里面 observer属性，监听变量的变化。来触发一个loadMore

```
//在search 组件中
properties: {
      // 监听more 这个字符串是否发生变化。来触发一个上拉加载的动作
      more:{
        type:String,
        observer:'loadMore'
      }
  },
  /**
   * 在page界面中上拉触底事件的处理函数
   */
  onReachBottom() {
    // 触底操作，每次修改more 随机16位字符串
     this.setData({
       more:random(16)
     })
  }
//在utils工具类中，封装一个random的随机字符串函数
// 随机生产字符串
const random = function generateMixed(n) {
  var res = "";
  for (var i = 0; i < n; i++) {
    var id = Math.ceil(Math.random() * 35);
    res += chars[id];
  }
  return res;
}

```

由于分页加载可能是多个界面使用，这里我们封装到behaviors中（类似mixin）。

```
//加载更多的判断
 hasMore() {
     //  这里由于 github 数据较多，进行mock处理
     return this.data.dataArray.length <= (this.data.total / 100)
 },

```

```
//解决重复加载数据，使用锁的方式。避免死锁
 locked() {
     this.setData({
         loading: true
     })
 },

```

增强代码的阅读性，将是否正在search、loadingCenter、loading封装成函数

```

//增强代码的阅读性
  _showResult() {
      this.setData({
        searching: true
      })
    },
        
  _showLoadingCenter() {
      this.setData({
        loadingCenter: true
      })
    },

   locked() {
      this.setData({
        loading: true
      })
    },

```

##### 注意this.data与 this.setData直接赋值的区别

当需要刷新界面状态的时候，使用setData方式。如果仅仅是数据的变化，无关UI界面可以使用直接赋值的方式。

```
this.setData({
    loading:true
})
//
this.data.loading = ture

```

##### wx.request封装

这里采用class封装一个Http类，通过`Promise`方式。
```js

return new Promise((resolve, reject) => {

    this._request(url, resolve, reject, data, method)

})

_request(url, resolve, reject, data = {}, method = 'GET') {

    wx.request({

        url: config.api_base_url + url,

        method: method,

        data: data,

        success: (res) => {

        const code = res.statusCode.toString()

        if (code.startsWith('2')) {

        resolve(res.data)

        } else {

        reject()

        this._show_error(code)

    }

},

fail: (err) => {

    reject()

    this._show_error(1)

}

})

}

```
这个地方有个细节处理，在处理error的时候，通过一个数组来维护tips

```js
const tips = {

    1: '抱歉，出现一个错误',

    304: 'Not modified',

    403: 'Forbidden',

    422: 'Validation failed',

    503: 'Service unavailable'

}


//
_show_error(error_code) {

if (!error_code) {

error_code = 1

}

const tip = tips[error_code]

    wx.showToast({

    title: tip?tip:tips[1],

    icon: "none",

    duration: 2000

    })

}

```



源码传送门：[wx-search-cmp](https://github.com/BigPengZai/wx-searchCmp)















