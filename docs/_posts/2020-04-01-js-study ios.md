---
layout:     post
title:      "iOS理解函数响应式编程RxSwift"
subtitle:   "理解函数响应式编程"
date:       2022-06-21
author:     "Peyton"
header-img: "img/post-bg-ios9-web.jpg"
category: demo
tags:
    - App
    - iOS
    - 项目
---

Functional Programming
<!-- more -->


### 函数响应式编程

#### 函数式编程

`Functional Programming`

1、常见解释

函数式编程 是一种思维模式，一种编程思想，一种编程方式，一种编程范式

```
//常见的函数式编程 masonry,snapkit
make.centerY.equalTo(self.view).offset(100);
```

2、基本特性&优点

允许把函数本身作为参数传入另一个函数，同时还允许返回一个函数

```
//将数组中，针对>4的数字，+1处理，最后输出所有的偶数
let arr1 = [1,2,3,4,5,6,7,8,9,10]
       for item in arr1 {
           if(item>4){
               let num = item + 1;
               if(num % 2==0){
                   print(num)
               }
           }
       }
​
//函数式编程
arr1.filter{ $0 > 2}
      .filter{ ($0+1) % 2 == 1}
      .forEach { print($0) }
​
```

2.1优点

-   函数即不依赖外部的状态也不修改外部的状态：函数调用的结果不依赖调用的时间和空间状态，这样写的代码容易进行推理，不容易出错。这使得单元测试和调试都更容易。
-   线程安全：函数式编程可以帮我们解决这一痛点，每一个纯函数都是线程安全
-   代码层次非常清晰、代码可读性高、代码复用性高
-   代码简洁，直接面向开发需求

总结：1、函数式编程并不会减少我们的代码量，它改变的只是我们书写代码的方式

2、编程方式表达更接近于自然语言，调用表达可直译（对命名准确性要求高），注重结果。

#### 响应式编程

对象对某一数据流变化做出响应的这种编码方式称为响应式，动态感知数据的变化，从化刷新UI界面。

```
/**
举个栗子，在一般程序开发时
　　　　　　　　x= y + z
　　　　赋值之后 y 或者 z 的值变化后，x 的值不会跟着变化.　
*/
如果使用响应式编程，目标就是，如果 y 或者 z 的数值发生变化，x 的数值会同时发生变化
​
如何才能做到及时响应呢？ 
一般情况可以对 y 和 z 进行观察，一旦发生变化，及时通知 x 发生变化 
-----> 代理、通知、block 
​
```

在iOS开发中我们经常会响应一些事件`button`、`tap`、`textView`、`notifaction`、`KVO`、`NSTimer`等等这些，都需要做响应监听，响应后都需要在对应的响应事件中去做处理。而原生开发中，触发对象与响应方法是分离的，如button的初始化和点击响应方法是分离的，功能代码与逻辑代码分离。

### RxSwift简介

#### 基本定义

作为[ReactiveX](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2FReactiveX)家族之一的[RxSwift](https://github.com/ReactiveX/RxSwift)在`Github`截止现在`Star:22.3K`，`ReactiveX` 不仅仅是一个编程接口，它是一种编程思想的突破，它影响了许多其它的程序库和框架以及编程语言。它拓展了`观察者模式`，使你能够`自由组合多个异步事件`，而`不需要去关心线程`，`同步，线程安全`，`并发数据以及I/O阻塞`。

Tips:都说Rx的学习成本高，其实不然。api非常精简，使用起来还是比较顺畅。

```
       //1.创建序列
       Observable<String>.create{(obserber)->Disposable in
          //3.发送型号
           obserber.onNext("发送信号")
           return Disposables.create()
           //2.订阅序列
       }.subscribe(onNext: {
           (msg) in
           print("订阅到：(msg)")
       })
​
```

#### 核心流程

##### 1、创建序列


![rxswift-创建序列.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f2c5851eded747f3bd4c3fa5b2c63b17~tplv-k3u1fbpfcp-watermark.image?)
`观察序列` 的创建是利用协议拓展功能的create方法实现的，里面创建了一个 `AnonymousObservable（匿名可观察序列）` 命名还是体现了author的思维 ：这个类就是一个内部类，具备一些通用特性（具有自己功能的类才会命名）下面我列举的继承关系


![创建序列继承关系.jpg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/57a8c8faf0864f47a3b3cd897e4e5a54~tplv-k3u1fbpfcp-watermark.image?)

从上面的图，我们可以清晰的看到的继承关系。这个地方我们需要理解：

-   `create` 方法的时候创建了一个内部对象 `AnonymousObservable`

-   `AnonymousObservable` 保存了外界的闭包

    ```
    extension ObservableType {
       // MARK: create
    ​
       /**
        Creates an observable sequence from a specified subscribe method implementation.
    ​
        - seealso: [create operator on reactivex.io](http://reactivex.io/documentation/operators/create.html)
    ​
        - parameter subscribe: Implementation of the resulting observable sequence's `subscribe` method.
        - returns: The observable sequence with the specified implementation for the `subscribe` method.
        */
       public static func create(_ subscribe: @escaping (AnyObserver<Element>) ->Disposable) -> Observable<Element> {
           AnonymousObservable(subscribe)
       }
    }
    ```

-   `AnonymousObservable`继承了 `Producer` 具有非常重要的方法 `subscribe`

```
​
final private class AnonymousObservable<Element>: Producer<Element> {
   typealias SubscribeHandler = (AnyObserver<Element>) -> Disposable
​
   let subscribeHandler: SubscribeHandler
​
   init(_ subscribeHandler: @escaping SubscribeHandler) {
       self.subscribeHandler = subscribeHandler
   }
​
   override func run<Observer: ObserverType>(_ observer: Observer, cancel: Cancelable) -> (sink: Disposable, subscription: Disposable) where Observer.Element == Element {
       let sink = AnonymousObservableSink(observer: observer, cancel: cancel)
       let subscription = sink.run(self)
       return (sink: sink, subscription: subscription)
   }
}
​
```

##### 2、 订阅序列

`subscribe` 方法的拓展，创建了一个 AnonymousObserver (匿名内部观察者)，它这里的初始化是闭包参数，保存了外界的 `onNext, onError , onCompleted , onDisposed` 的处理回调闭包的调用。


![订阅者.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/133a0b54545044569c93c1054385cda9~tplv-k3u1fbpfcp-watermark.image?)
AnonymousObserver的继承关系


![AnonymousObserver内部观察者继承关系.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5dbb769058a9490fb71c37566394dec4~tplv-k3u1fbpfcp-watermark.image?)

-   `self.run` 这个代码最终由我们生产者 `Producer` 延伸到我们具体的事务代码 `AnonymousObservable.run`

    ![sink.run]()

<!---->

-   `parent` 就是上面传过来的`AnonymousObservable`对象

    ```
    func run(_ parent: Parent) -> Disposable {
    ​
       return    parent.subscribeHandler(AnyObserver(self))
    ​
     }
    ```

-   最终造方法里面，我们创建了一个结构体 `AnyObserver` 保存了一个信息 `AnonymousObservableSink`

    ```
    public static func create(_ subscribe: **@escaping** (AnyObserver<Element>) ->Disposable) -> Observable<Element> {
    ​
    return    AnonymousObservable(subscribe)
    ​
     }
    ```

##### 3、发送信号

`obserber.onNext("msg")` 的本质是： `AnyObserver.onNext("msg")`

```
​
let observer = AnonymousObserver<Element> { event in
               
               #if DEBUG
                   synchronizationTracker.register(synchronizationErrorMessage:.default)
                   defer { synchronizationTracker.unregister() }
               #endif
               
               switch event {
               case .next(let value):
                   onNext?(value)
               case .error(let error):
                   if let onError = onError {
                       onError(error)
                   }
                   else {
                       Hooks.defaultErrorHandler(callStack, error)
                   }
                   disposable.dispose()
               case .completed:
                   onCompleted?()
                   disposable.dispose()
               }
           }
​
```

### 总结

`RxSwift` 是 `Rx` 为 `Swift` 语言开发的一门函数响应式编程语言， 它可以代替iOS系统的 `Target Action` / `代理` / `闭包` / `通知` / `KVO`,同时还提供`网络`、`数据绑定`、`UI事件处理`、`UI的展示和更新`、`多线程`等等

`RxSwift`一定程度上弥补`Swift`的灵活性

-   `RxSwift`使得代码复用性较强，减少代码量
-   `RxSwift`因为声明都是不可变更，增加代码可读性
-   `RxSwift`使得更易于理解业务代码，抽象异步编程，统一代码风格
-   `RxSwift`使得代码更易于编写集成单元测试，增加代码稳定性















