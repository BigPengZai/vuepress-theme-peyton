---
layout:     post
title:      "打工人2022年中小结"
subtitle:   "年中小结"
date:       2022-07-20
author:     "Peyton"
header-img: "img/post-bg-ios9-web.jpg"
category: demo
tags:
    - Web
    - 总结
    - 项目
---

2022年中小结。。。。
<!-- more -->


#### 前言

坐标上海浦东，可以说是疫情中的半年。上海从第一季到最近的第三季，一波接一波。不亏是魔都阿。所幸工作偏互联网行业，疫情期间在家办公，还有口饭吃。另外公司也派发了物资，小区也有物资，再加上给力的团长们，过的挺好。还顺便学习了好几个新菜。不然天天泡面换谁也扛不住。当然了这期间发生了一些列的事件，有好的也有不好的，这里不做评论。但始终相信人间有真情，人间有大爱。

下面是公司发的物资，两大箱。稳稳的幸福。回想那会我抱着物资回屋，电梯口的路人甲看我抱着两大箱都投来了羡慕的眼神。哈哈。。。


![WechatIMG28.jpeg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/44d27b87ad994de8bc0a615cedd25d47~tplv-k3u1fbpfcp-watermark.image?)

疫情期间在家办公，省去了地铁的时间。可以充分的利用起来，比如：js的犀牛书
    Ps:其实我就没有看几页，主要的时间是线上会议、去做核算、抢菜

#### 文章

参加了掘金论坛的6月更文挑战赛，其中官方推荐了三篇文章。[Android模块化开发](https://juejin.cn/post/7111317128979939341)、[微前端拆分巨石引用](https://juejin.cn/post/7110231164777922591)、[Element-plus提交pr有感](https://juejin.cn/post/7113606000967417863) 感谢官方~

[微前端拆分巨石引用](https://juejin.cn/post/7110231164777922591)：理解微前端核心原则，以及核心思想。本质：用fetch去请求js并渲染在指定的DOM容器。通过在主应用引入每个子应用的入口文件(main.js)，进行解析，并指定渲染的容器(DOM)，其次每个子应用设置打包的文件为[UMD](https://link.juejin.cn/?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000012419990)，然后在main.js暴露(`export`)生命周期方法(`bootstrap`、`mount`，`unmount`)，然后再其`mount`进行渲染，也就是`new Vue(...)`，并在`unmount`执行`destory`。

[Element-plus提交pr有感](https://juejin.cn/post/7113606000967417863)：简介了Element-plus框架，关于本次提交pr，通过一个简单的 `loading` 组件去阅读框架的源码，分析内部的方法。以及element-plus框架整体的项目结构还时比较清晰的，日常开发中值得我们去借鉴。

函数的单一原则，公共代码的封装抽取。

`jest` 单元测试（目前已经弃用`Jest`，用`Vitest`）、`commitizen` git 提交规范神器、包括 `eslint` 善于使用工具，提高我们的开发效率。

英文的重要性，关于这一点我就不多说了。

    Ps：评论区已经收到了官方成员的回复。三关巨大佬~

[Vue 3 源码阅读流程](https://juejin.cn/post/7065289489085628447)：其实这篇文章花费了很多的时间，理解Vue3的三大核心功能模块，Compiler模块、Runtime模块、Reactivity模块。

也可以从我后续的文章[带着问题阅读Vue3源码](https://juejin.cn/post/7114665411026616356)，通过问题来理解源码，以及为什么要阅读源码。比如：为什么setup 不建议使用this、 v-for中key的作用、defineProperty 与Proxy 的区别等等。。。

[小程序中封装高阶组件](https://juejin.cn/post/7122800342764355591) ：本次带来的是一个`search`组件的封装，源码已经上传到github文章结尾处自行采摘，数据源来自[github-searchRepos](https://link.juejin.cn/?target=https%3A%2F%2Fdocs.github.com%2Fen%2Frest%2Fsearch%23search-repositories)。

功能简介

包含的功能模块：历史搜索、热门搜索、input搜索、分页数据加载等

[如何回答Vue3与Vue2的区别](https://juejin.cn/post/7110593886396874766) :主要是阐述了从源码角度、从性能角度、从API角度不同点。

[Android模块化开发](https://juejin.cn/post/7111317128979939341)：什么是模块化开发，模块化方案以及运用到项目中去。

[iOS理解函数响应式编程RxSwift](https://juejin.cn/post/7111659728190570504)，这里思想是共通的，理解函数响应式编程。前端开发中也开始逐渐弃用面向对象开发，拥抱函数式编程。

#### 读书

书单：

-   犀牛书《JavaScript 权威指南》
-   一行禅师《和繁重的工作一起修行》

关于读书就不竖立flag 了，就说一句读书使人进步吧。

#### 生活

一般情况周末的话，会约着同事去打篮球，（ps:目前在上海浦东这边，洛克公园。离的近的可以约起来阿。）

![球馆.jpg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2041fad90c143fcb3ce96cdaa537ffc~tplv-k3u1fbpfcp-watermark.image?)

比较喜欢科比、麦迪，大姚就不说了，中国男篮绝对领袖。说道这里又忍不住要说下我们的亚洲第一控卫了（Ps:关键局得tm一分你真牛逼。）或者玩下lol。喜欢这种竞技性、打配合的活动。

#### 计划

周末的话先完成草稿箱的里面文章吧，`混合开发-uniApp`，`vue3+element-plus+vite封装高阶组件`,`桌面端开发利器-electron`,`前端部署CI/CD`，`React18源码阅读`

![草稿箱.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ddfe187b9e944abab68c67dbaf5f71ff~tplv-k3u1fbpfcp-watermark.image?)
其次依然是大前端方向、微前端、lowcode。这里面依然有很多的玩法以及乐趣，欢迎大家来讨论区讨论哦~
[文章主页](https://juejin.cn/user/1820446983193261/posts)














