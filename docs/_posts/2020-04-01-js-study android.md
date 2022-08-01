---
layout:     post
title:      "Android模块化开发"
subtitle:   "Android模块拆分项目"
date:       2022-06-20
author:     "Peyton"
header-img: "img/post-bg-ios9-web.jpg"
category: demo
tags:
    - App
    - Android
    - 项目
---

模块化简单概括就是把一个功能完整的 App或模块拆分成多个子模块
<!-- more -->


# 1 简介

### 1.1 什么是模块化

模块化简单概括就是把一个功能完整的 App或模块拆分成多个子模块, 每个子模块可以独立编译和运行, 也可以任意组合成另一个新的 App或模块, 每个模块即不相互依赖但又可以相互交互, 遇到某些特殊情况甚至可以升级或者降级。

模块指的是独立的业务模块。

组件指的是单一的功能组件。如视频组件、支付组件。每个组件都可以以一个单独的module开发，并且可以单独抽取出来作为SDK对外发布使用。

模块和组件最明显的区别是模块相对组件来说粒度更大。一个模块中可能包含多个组件。在划分的时候，模块化是业务导向，组件化是功能导向。

模块化和组件化，个人感觉并不需要严格意义上的区分。

### 1.2 为什么要模块化

现在的项目随着需求的增加规模变得越来越大。。。什么解耦合。。。使用模块化架构，业务模块分离，高内聚，低耦合，代码边界清晰，每一个模块业务都可以拆分出来独立运行。


- 结构清晰，各个模块的代码实现分离，不会搅在一起。在代码review或者二次开发的时候一目了然，不会满世界去找代码。 
- 协同开发的时候更灵活，不用再等同组其他同事的模块开发完成后才能运行app，自己负责的模块稍加修改就可以当做主app直接跑起来。 
- 便于维护。每个模块的代码、布局文件、资源文件可以随时从项目中通过gradle配置去除掉。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/864fa191db1f49c381072b88871b37c1~tplv-k3u1fbpfcp-watermark.image?)

### 1.3 分析现有的模块化方案

很多大厂的模块化方案是以 多工程+ 多 Module的结构(微信, 美团等超级 App更是以 多工程+ 多 Module+ 多 P 工程(以页面为单元的代码隔离方式)的三级工程结构)。

## 2 模块化方案描述

App目前采用的是 单工程+ 多 Module的结构。

宿主App +较独立功能模块Module的方式，这样也是对于开发项目规模还不是特别大的情况, 开发人员也较少时, 开发效率较高的方案。

### 2.2 架构图详解

目前架构一共分为三层, 从低到高依次是基础层, 业务层和宿主层, 由于目前项目较小所以三层都集中在一个工程中, 当然了我们可以根据项目的规模和开发人员的数量拆分成多个工程协同开发


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d49da3cf07e436f93d6f9e8eabed21b~tplv-k3u1fbpfcp-watermark.image?)

#### 2.2.1 宿主层

宿主层位于最上层, 主要作用是作为一个 App壳, 将需要的模块组装成一个完整的 App, 这一层可以管理整个 App的生命周期(比如 Application的初始化和各种组件以及三方库的初始化)

#### 2.2.2 业务层

业务层位于中层, 里面主要是根据业务需求和应用场景拆分过后的业务模块, 每个模块之间互不依赖, 但又可以相互交互, 比如App中播放器业务模块、运动步数获取模块、log日志输出模块。

Tips: 每个业务模块都可以拥有自己独有的 SDK 依赖和自己独有的 UI 资源 (如果是其他业务模块都可以通用的 SDK 依赖 和 UI 资源 就可以将它们抽离基础 SDK和UI 组件 中


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/864fa191db1f49c381072b88871b37c1~tplv-k3u1fbpfcp-watermark.image?)

2.2.2.1 业务模块的拆分!!!!!

写业务之前先不要急着动手敲码, 应该先根据初期的产品需求到后期的运营规划结合起来清晰的梳理一下业务在未来可能会发生的发展, 确定业务之间的边界, 以及可能会发生的变化, 最后再确定下来真正需要拆分出来的业务模块再进行拆分

#### 2.2.3 基础层

基础层位于最底层, 里面又包括 核心基础业务模块、公共服务模块、 基础 SDK 模块, 核心基础业务模块和 公共服务模块主要为业务层的每个模块服务, 基础 SDK 模块含有各种功能强大的团队自行封装的 SDK以及第三方 SDK， 为整个平台的基础设施建设提供动力

##### 2.2.3.1 核心基础业务

核心基础业务为 业务层的每个业务模块提供一些与业务有关的基础服务, 比如在项目中以用户角色分为 2 个端口, 用户可以扮演多个角色, 但是在线上只能同时操作一个端口的业务, 这时每个端口都必须提供一个角色切换的功能, 以供用户随时在多个角色中切换, 这时在项目中就需要提供一个用于用户自由切换角色的管理类作为 核心基础业务被这 2 个端口所依赖(类似 拉勾, Boss 直聘等 App可以在招聘者和应聘者之间切换)

核心基础业务的划分应该遵循是否为业务层大部分模块都需要的基础业务, 以及一些需要在各个业务模块之间交互的业务, 都可以划分为 核心基础业务

2.2.3.2 公共服务

公共服务是一个名为 ```CommonService的 Module```, 主要的作用是用于 业务层各个模块之间的交互(自定义方法和类的调用), 包含自定义 Service接口, 和可用于跨模块传递的自定义类

主要流程是:

提供服务的业务模块:

在公共服务(```CommonService```) 中声明 Service接口 (含有需要被调用的自定义方法), 然后在自己的模块中实现这个 Service接口, 再通过 ARouter API暴露实现类

使用服务的业务模块:

通过 ARouter的 API拿到这个 Service接口(多态持有, 实际持有实现类), 即可调用 Service接口中声明的自定义方法, 这样就可以达到模块之间的交互

跨模块传递的自定义类:

在 公共服务中定义需要跨模块传递的自定义类后 (Service中的自定义方法和 EventBus中的事件实体类都可能需要用到自定义类), 就可以通过 ARouter API, 在各个模块的页面之间跨模块传递这个自定义对象 (ARouter要求在 URL中使用 Json参数传递自定义对象必须实现 SerializationService接口)

Tips: 建议在 CommonService 中给每个需要提供服务的业务模块都建立一个单独的包, 然后在这个包下放 Service 接口 和 需要跨模块传递的自定义类, 这样更好管理

2.2.3.3 基础 SDK

基础 SDK是一个名为 ```CommonSDK的 Module```, 其中包含了大量功能强大的 SDK, 提供给整个架构中的所有模块

基础 SDK中的 UI 组件是一个名为 CommonRes的 Module, 主要放置一些业务层可以通用的与 UI有关的资源供所有业务层模块使用, 便于重用、管理和规范已有的资源

Tips: 值得注意的是, 业务层的某些模块如果出现有资源名命名相同的情况 (如两个图片命名相同), 当在宿主层集成所有模块时就会出现资源冲突的问题, 这时注意在每个模块的 build.gradle 中使用 resourcePrefix 标签给每个模块下的资源名统一加上不同的前缀即可解决此类问题


```Android
android {

defaultConfig {

minSdkVersion rootProject.ext.android["minSdkVersion"]

...

}

resourcePrefix "public_"

}

```


可以放置的资源类型有:

通用的 Style, Theme

通用的 Layout

通用的 Color, Dimen, String

通用的 Shape, Selector, Interpolator

通用的 图片资源

通用的 动画资源

通用的 自定义 View

通用的第三方 自定义 View

##### 2.2.3.2 其他 SDK

其他 SDK主要是 基础 SDK依赖的一些业务层可以通用的 第三方库和 第三方 SDK(比如 ARouter, 腾讯 X5 内核), 便于重用、管理和规范已有的 SDK依赖

### 2.3 跨组件通信

#### 2.3.1 为什么需要跨组件通信?

因为各个业务模块之间是各自独立的, 并不会存在相互依赖的关系, 所以一个业务模块是访问不了其他业务模块的代码的, 如果想从 A业务模块的 A页面跳转到 B业务模块的 B页面, 光靠模块自身是不能实现的, 所以这时必须依靠外界的其他媒介提供这个跨组件通信的服务

#### 2.3.2 跨组件通信场景

跨组件通信主要有以下两种场景:

第一种是组件之间的页面跳转 (Activity到 Activity, Fragment到 Fragment, Activity到 Fragment, Fragment到 Activity) 以及跳转时的数据传递 (基础数据类型和可序列化的自定义类类型)

```
/**
* 隐士跳转首页 清空现有栈，创建新栈
*/
public static void newTaskMainActivity(Activity activity){
  Intent intent = new Intent();
  intent.setAction("com.byxgame.fusioncocos.main.MainActivity");
  intent.addCategory("android.intent.category.DEFAULT");
  intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK |         Intent.FLAG_ACTIVITY_NEW_TASK);
  activity.startActivity(intent);
}
```

第二种是组件之间的自定义类和自定义方法的调用(组件向外提供服务)

2.3.3 跨组件通信方案

其实以上两种通信场景甚至其他更高阶的功能在 ARouter中都已经被实现, ARouter是 Alibaba开源的一个 Android路由中间件, 可以满足很多模块化的需求。

二：EventBus来作为服务提供的另一种方式, 大家知道 EventBus因为其解耦的特性, 如果被滥用的话会使项目调用层次结构混乱, 不便于维护和调试, 所以本方案使用 [AndroidEventBus](https://github.com/hehonghui/AndroidEventBus)其独有的 Tag, 可以在开发时更容易定位发送事件和接受事件的代码, 如果以组件名来作为 Tag的前缀进行分组, 也可以更好的统一管理和查看每个组件的事件, 当然也不建议大家过多使用 EventBus


### 2.4 组件的生命周期

每个组件 (模块) 在测试阶段都可以独立运行, 在独立运行时每个组件都可以指定自己的 Application, 这时组件自己管理生命周期就轻而易举, 比如想在 onCreate中初始化一些代码都可以轻松做到, 但是当进入集成调试阶段, 组件自己的 Application已不可用, 每个组件都只能依赖于宿主的生命周期, 这时每个组件如果需要初始化自己独有的代码。

## 最后

![就是干.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/84e866a65346423b9c4115e1e79c14f1~tplv-k3u1fbpfcp-watermark.image?)

## 应用到项目中

### 3.1 如何让模块独立运行?

```js
在项目根目录的 gradle.properties中, 改变 isBuildModule的值即可

#isBuildModule 为 true 时可以使每个组件独立运行, false 则可以将所有组件集成到宿主 App 中

isBuildModule=true
```



### 3.2 配置 AndroidManifest

由于组件在独立运行时和集成到宿主时可能需要 AndroidManifest配置不一样的参数, 比如组件在独立运行时需要其中的一个 Activity配置了 <action android:name="android.intent.action.MAIN"/> 作为入口, 而当组件集成到宿主中时, 则依赖于宿主的入口, 所以不需要配置 <action android:name="android.intent.action.MAIN"/>, 这时我们就需要两个不同的 AndroidManifest应对不同的情况

在组件的 build.gradle中加入以下代码, 即可指定不同的 AndroidManifest, 具体请看项目代码

```android
android {

sourceSets {

main {

jniLibs.srcDirs = ['libs']

if (isBuildModule.toBoolean()) {

manifest.srcFile 'src/main/debug/AndroidManifest.xml'

} else {

manifest.srcFile 'src/main/release/AndroidManifest.xml'

}

}

}

}
```



### 3.3 配置 ConfigModule(GlobalConfiguration)

ConfigModule在 [最终执行方案(2.4.3)]() 中提到过, GlobalConfiguration是实现类, 他可以给框架配置大量的自定义参数

项目 CommonSDK中提供有一个 GlobalConfiguration用于配置每个组件都会用到的公用配置信息, 但是每个组件可能都需要有一些私有配置, 比如初始化一些特有属性, 所以在每个组件中也需要实现 ConfigModule, 具体请看项目代码

需要注意的是, 在 [配置 AndroidManifest(3.2)]() 中提到过组件在独立运行时和集成到宿主时所需要的配置是不一样的, 当组件在独立运行时需要在 AndroidManifest中声明自己私有的 GlobalConfiguration和 CommonSDK公有的 GlobalConfiguration, 但在集成到宿主时, 由于宿主已经声明了 CommonSDK的公有 GlobalConfiguration, 所以在 AndroidManifest只需要声明自己私有的 GlobalConfiguration, 这里也说明了 AndroidManifest在不同的情况需要做出不同的配置

### 3.4 RouterHub

RouterHub用来定义路由器的路由地址, 以组件名作为前缀, 对每个组件的路由地址进行分组, 可以统一查看和管理所有分组的路由地址

RouterHub存在于基础库, 可以被看作是所有组件都需要遵守的通讯协议, 里面不仅可以放路由地址常量, 还可以放跨组件传递数据时命名的各种 Key值, 再配以适当注释,


github：<https://github.com/alibaba/ARouter/blob/master/README_CN.md>














