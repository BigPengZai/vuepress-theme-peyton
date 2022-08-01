---
layout:     post
title:      "微前端拆分巨石应用"
subtitle:   "由单一的单体应用转变为多个小型前端应用"
date:       2022-06-17
author:     "Peyton"
header-img: "img/post-bg-ios9-web.jpg"
category: demo
tags:
    - Web
    - Vue3
    - 微应用
---

微前端的核心目标是将巨石应用拆解成若干可以自治的松耦合微应用
<!-- more -->


### 如何减少包体积

#### 拆

采用微前端的设计思想,将 Web 应用由单一的单体应用转变为多个小型前端应用。

#### 微前端核心原则

· 技术栈无关: 主应用不限制子应用接入的技术栈，每个应用的技术栈选型可以配合业务情景选择。

· 独立开发、独立部署：既可以组合运行，也可以单独运行。

· 环境隔离：应用之间 JavaScript、CSS 隔离避免互相影响

· 消息通信：统一的通信方式，降低使用通信的成本

· 依赖复用：解决依赖、公共逻辑需要重复维护的问题

### 业务场景如何拆分

#### 拆分原则

-   尽量减少彼此之间的通信和依赖，微前端的通信交互、链接跳转等操作所带来等成本其实是很大的，所以在拆分的时候尽量“完全独立，互不依赖”

-   微应用拆分的时候，避免盲目过度拆分。根据实际情况逐步拆分，按业务线拆分。

-   应用之间应该尽量解耦，子应用的事情由子应用来完成。不盲目维护到父应用中。

    -   如：子应用的一些标识，如：路由前缀，应用名称，根节点容器名称，依赖库的使用

#### 按照业务来拆分

-   保持核心业务的独立性，把无关的子业务拆分解耦。业务之间开发互不影响，业务之间可拆解微应用使用，单独打包单独使用。
-   业务关联紧密的功能单元拆成一个微应用，反之关联不紧密的可以考虑拆分成多个微应用。tips:判断业务关联是否紧密的标准：看这个微应用与其他微应用是否有频繁的通信需求。
-   如果有两个微应用本身就是服务于同一个业务场景，合并成一个微应用可能会更合适。
-   分析产品业务，将产品逻辑耦合度高的功能合并到一起。

#### 拆分示例


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1dfe7aa924c44fe280755839113fb970~tplv-k3u1fbpfcp-watermark.image?)

### 方案对比

#### 市面框架对比


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/07483ed177e8483caa889235db2cac42~tplv-k3u1fbpfcp-watermark.image?)

#### 如何选择-对比维度

-   稳定性，该方案社区完善，有较多的成熟案例，同时保持较高的 活跃性
-   可拓展性：支持定制化开发，提供较高的拓展
-   可控性：发生问题后，可根据文档进行排查，以及常见QA

### 具体实现

#### qiankun

[qiankun官方文档](https://qiankun.umijs.org/zh/guide/tutorial#%E4%B8%BB%E5%BA%94%E7%94%A8)

##### qiankun的主要流程


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13def692895e4fa7a8d866759449d695~tplv-k3u1fbpfcp-watermark.image?)

##### 使用步骤

###### 主应用

主应用不限技术栈，只需要提供一个容器 DOM，然后注册微应用并 `start` 即可。

先安装 `qiankun` ：

```
$ yarn add qiankun # 或者 npm i qiankun -S
```

注册微应用并启动：

```
import { registerMicroApps, start } from 'qiankun';
​
registerMicroApps([
{
  name: 'reactApp',
  entry: '//localhost:3000',
  container: '#container',
  activeRule: '/app-react',
},
{
  name: 'vueApp',
  entry: '//localhost:8080',
  container: '#container',
  activeRule: '/app-vue',
},
{
  name: 'angularApp',
  entry: '//localhost:4200',
  container: '#container',
  activeRule: '/app-angular',
},
]);
// 启动 qiankun
start();
```

###### 微应用

0.  在 `src` 目录新增 `public-path.js`：

    ```
    if (window.__POWERED_BY_QIANKUN__) {
     __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
    }
    ```

0.  入口文件 `main.js` 修改，为了避免根 id `#app` 与其他的 DOM 冲突，需要限制查找范围。

    ```
    import './public-path';
    import Vue from 'vue';
    import VueRouter from 'vue-router';
    import App from './App.vue';
    import routes from './router';
    import store from './store';
    ​
    ​
    Vue.config.productionTip = false;
    ​
    ​
    let router = null;
    let instance = null;
    function render(props = {}) {
     const { container } = props;
     router = new VueRouter({
       base: window.__POWERED_BY_QIANKUN__ ? '/app-vue/' : '/',
       mode: 'history',
       routes,
    });
    ​
    ​
     instance = new Vue({
       router,
       store,
       render: (h) => h(App),
    }).$mount(container ? container.querySelector('#app') : '#app');
    }
    ​
    ​
    // 独立运行时
    if (!window.__POWERED_BY_QIANKUN__) {
     render();
    }
    ​
    ​
    export async function bootstrap() {
     console.log('[vue] vue app bootstraped');
    }
    export async function mount(props) {
     console.log('[vue] props from main framework', props);
     render(props);
    }
    export async function unmount() {
     instance.$destroy();
     instance.$el.innerHTML = '';
     instance = null;
     router = null;
    }
    ```

0.  打包配置修改（`vue.config.js`）：

    ```
    const { name } = require('./package');
    module.exports = {
     devServer: {
       headers: {
         'Access-Control-Allow-Origin': '*',
      },
    },
     configureWebpack: {
       output: {
         library: `${name}-[name]`,
         libraryTarget: 'umd', // 把微应用打包成 umd 库格式
         jsonpFunction: `webpackJsonp_${name}`,
      },
    },
    };
    ```



#### webpack5mf

##### 使用步骤

1、新建文件夹a，执行下面命令，初始化项目，得到一个package.json文件

```
npm init
```

2、安装以下包，至于webpack的版本只要是webpack5或5以上的都行，添加build命令

```
yarn add webpack webpack-cli -D
```

3、配置package.json文件

```
{
 "scripts": {
   "start": "webpack serve",
   "build": "webpack"
},
 "devDependencies": {
   "@babel/core": "7.9.6",
   "babel-loader": "^8.1.0",
   "html-webpack-plugin": "^4.5.0",
   "vue-loader": "^15.9.3",
   "vue-template-compiler": "^2.6.12",
   "webpack": "^5.0.0",
   "webpack-dev-server": "^3.11.0"
},
 "dependencies": {
   "vue": "^2.6.12",
   "webpack-cli": "^4.0.0"
}
}
​
```

4、文件夹根目录下新建webpack.config.js,导出主应用的组件Button

```
new ModuleFederationPlugin({
     // 提供给其他服务加载的文件
     filename: "remoteEntry.js",
     // 唯一ID，用于标记当前服务
     name: "app1",
     library: { type: "var", name: "app1" },
     // 需要暴露的模块，使用时通过 `${name}/${expose}` 引入
     exposes: {
       "./Button": "./src/components/Button.vue",
    },
  })
```

5、子应用中，webpack.config.js引入ModuleFederationPlugin并进行配置

```
new ModuleFederationPlugin({
     name: "app2",
     remotes: {
       app1: "app1@http://localhost:3000/remoteEntry.js",//这个地方localhost:3000为主应用的run的连接
    },
  }),
```

6、子引用中使用 主应用中组件

```
<script>
export default {
 components: {
   Button: () => import("app1/Button"),
},
};
</script>
```

7、demo示例

[官方文档](https://module-federation.github.io/blog/get-started)



### 总结

#### 微前端的本质

用fetch去请求js并渲染在指定的DOM容器。通过在主应用引入每个子应用的入口文件(main.js)，进行解析，并指定渲染的容器(DOM)，其次每个子应用设置打包的文件为[UMD](https://link.juejin.cn/?target=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000012419990)，然后在main.js暴露(`export`)生命周期方法(`bootstrap`、`mount`，`unmount`)，然后再其`mount`进行渲染，也就是`new Vue(...)`，并在`unmount`执行`destory`。

#### 关于qiankun

##### “简单”

由于主应用微应用都能做到技术栈无关，qiankun 对于用户而言只是一个类似 jQuery 的库，需要调用几个 qiankun 的 API 即可完成应用的微前端改造。同时由于 qiankun 的 HTML entry 及沙箱的设计，使得微应用的接入像使用 iframe 一样简单。

##### 解耦/技术栈无关

微前端的核心目标是将巨石应用拆解成若干可以自治的松耦合微应用，而 qiankun 的诸多设计均是秉持这一原则，如 HTML entry、沙箱、应用间通信等。这样才能确保微应用真正具备 独立开发、独立运行 的能力。

##### 对比mf

相对于mf可拓展性更强，mf是基于webpack5的新特新，技术栈统一，旧项目的改造成本高。qiankun框架目前已经发布到v2.7.0 的版本，保持半个月一次的更新。有 3 年使用场景以及 Issue 问题解决积累，社区也比较活跃，蚂蚁内部服务了超过 200+ 线上应用。













