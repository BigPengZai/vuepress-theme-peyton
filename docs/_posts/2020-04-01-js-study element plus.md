---
layout:     post
title:      "Element-plus提交pr有感"
subtitle:   "阅读三方库源码"
date:       2022-06-27
author:     "Peyton"
header-img: "img/post-bg-ios9-web.jpg"
category: demo
tags:
    - Web
    - Element-plus
    - 源码
---

关于本次提交pr去阅读框架的源码
<!-- more -->


#### Element-plus简介

基于 Vue 3，面向设计师和开发者的组件库

Element Plus 使用 TypeScript 与 Vue 3.2 开发，提供完整的类型定义文件。并使用 Composition API 降低耦合，简化逻辑。在2022-02-07对外发布稳定版本v2.0.0，我基本是从1.0.0-beta版本开始关注，那会刚好也是Vue3 刚刚发布，不得不说饿了么团队重构的速度还挺快。

#### 与Ant Design不同点


Ps：这里我们不谈ele与ant的具体性能参数分析啥的，工作中需要取舍的话。套用尤大大的话就是哪个给的钱多我用哪个。大厂的源码都值得我们分析与学习。


以下是个人的一些总结（通过阅读Ant Design 与 Element-plus的源码发现）

1、ant的框架jsx语法用的比较多，hooks的写法遵循react语法较多。

2、ant的库重一点，但他们家的性能组件开始有收费版本，并没有开源。而ele一直在开源，在plus版本中也对性能组件进行重构，在源码中 `**-v2`版本中都有体现。

3、element-puls 按需引用的方式 提供了插件版本的方式，相对于传统组件方式按需引入的方式更加简洁、方便。

```
按需导入 #
您需要使用额外的插件来导入要使用的组件。
自动导入
推荐
#
首先你需要安装unplugin-vue-components 和 unplugin-auto-import这两款插件
npm install -D unplugin-vue-components unplugin-auto-import
然后把下列代码插入到你的 Vite 或 Webpack 的配置文件中
具体的方式请参考官方文档
```

#### 关于loading 组件的pr

本次提交的pr是关于loading组件的


![loading-pr.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/86e7b5b6f19647169ec79637f835dcbc~tplv-k3u1fbpfcp-watermark.image?)




#### 背景

我在搭建一个vue3+element-plus+vite项目框架的时候，基于axios封装网络请求hook的时候发现。需要一个全局的loading效果，按照element-plus的文档使用·`loading`组件

```
 
 //在拦截器中添加loading
this.instance.interceptors.request.use(
      (config) => {
        if (this.showLoading) {
          this.loading = ElLoading.service({
            lock: true,
            text: '正在请求数据....',
            background: 'rgba(0, 0, 0, 0.5)'
          })
        }
        return config
      },
      (err) => {
        return err
      }
    )
//在响应拦截中关闭loading
this.instance.interceptors.response.use(
      (res) => {
        // 将loading移除
        this.loading?.close()
        const data = res.data
        if (data.returnCode === '-1001') {
          console.log('请求失败~, 错误信息')
        } else {
          return data
        }
      },
      (err) => {
        // 将loading移除
        this.loading?.close()
        // 例子: 判断不同的HttpErrorCode显示不同的错误信息
        if (err.response.status === 404) {
          console.log('404的错误~')
        }
        return err
      }
    )
```

封装与处理是没有问题的，但当进入某个业务场景的时候，需要发起多个网络请求的时候loading 出现了短暂的重叠效果。于是对于 `loading`组件进行了排查。

仔细观察前0.5s左右出现loading 背景色重叠

![1656424812859967_.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2576fe5f6bce41308442768ffe006d9d~tplv-k3u1fbpfcp-watermark.image?)


#### 分析问题

##### Step1：

fork 一份到自己的项目下，不要直接在仓库下建分支。然后clone下来编译处理，目前element-plus 项目用的pnpm进行的包管理。

Ps：这里简单说下pnpm - performant npm。
- 在 2017 年正式发布，定义为快速的，节省磁盘空间的包管理工具，开创了一套新的依赖管理机制。

- 与依赖提升和扁平化的 node_modules 不同，pnpm 引入了另一套依赖管理策略：内容寻址存储。

- 该策略会将包安装在系统的全局 store 中，依赖的每个版本只会在系统中安装一次。pnpm 的安装速度在大多数场景都比 npm 和 yarn 快 2 倍，节省的磁盘空间也更多。

##### Step2：

运行项目了解项目结构，element-plus 使用的vite 进行打包，速度杠杠滴。

```
pnpm run dev
```


![element-plus 项目结构.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c4c7e3a59429477ebbad67c3462c7690~tplv-k3u1fbpfcp-watermark.image?)

##### Step3:

定位问题组件 loading ，在 packages 文件夹下- loading文件夹。通过观察ele的项目结构基本都采用：**tests**文件夹、src文件夹、style文件夹、index文件入口。非常清晰标准的目录即构，值得我们借鉴。


![loading组件目录结构.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/069eb4828549445699768fcba44cfeee~tplv-k3u1fbpfcp-watermark.image?)

Step4：

分析loading 组件的源码,`elLoadingComponent`内部主要的方法

`setText`

`destroySelf`

`close`

`handleAfterLeave`

`elLoadingComponent`

我们主要是要解决 重叠、覆盖或者与移除相关的问题，可以与之相关的方法。无非就是`destroySelf`,`close`,`elLoadingComponent`

首先我们分析 `elLoadingComponent` ，setup函数中 return了一个 h函数，（Ps:h函数的本质其实就是返回一个vnode节点，更详细的解读请大家关注我之前发表的 [   Vue3源码解读 ](https://juejin.cn/post/7065289489085628447)、[手撕mini](https://juejin.cn/post/7112387951241199630)）。

```
default: withCtx(() => [
              withDirectives(
                createVNode(
                  'div',
                  {
                    style: {
                      backgroundColor: data.background || '',
                    },
                    class: [
                      'el-loading-mask',
                      data.customClass,
                      data.fullscreen ? 'is-fullscreen' : '',
                    ],
                  },
                  [
                    h(
                      'div',
                      {
                        class: 'el-loading-spinner',
                      },
                      [spinner, spinnerText]
                    ),
                  ]
                ),
                [[vShow, data.visible]]
              ),
            ]),
 
 const vm = createApp(elLoadingComponent).mount(document.createElement('div'))
```

这里有个比较重要的属性 `vm`,(Ps：createApp().mount() 这个方法的作用，在我之前发表的[   Vue3源码解读 ](https://juejin.cn/post/7065289489085628447)中有详细的解读。另外在面试中这个问题也是出现的比较高频)

```
 const vm = createApp(elLoadingComponent).mount(document.createElement('div'))
```

最后 return出去，至此`elLoadingComponent` 的主要目的就是 创建一个默认的loading 并且挂载到一个新建的div节点上面。

接下来我们分析 `close` 方法，根据我们出现的error，问题极有可能出现在这里。

close方法中，首先进行了一些逻辑的判断处理。我们一带而过。其中有个比较重要的方法 `setTimeout` ，400ms后 执行了一个 `destroySelf` 方法。根据经验 问题极有可能出现在这里，前400ms中出现了loading的重叠。

```
function close() {
    if (options.beforeClose && !options.beforeClose()) return
    const target = data.parent
    target.vLoadingAddClassList = undefined
    afterLeaveFlag.value = true
    clearTimeout(afterLeaveTimer)
    afterLeaveTimer = window.setTimeout(() => {
      if (afterLeaveFlag.value) {
        afterLeaveFlag.value = false
        destroySelf()
      }
    }, 400)
    data.visible = false
    options.closed?.()
  }
```

我们赶紧进入到 `destroySelf` 中一看究竟。这里根据我们的开发经验或者 有一定封装思想的话，我们应该可以猜到这里肯定要进行一些属性的移除以及从父节点中移除loading组件。翻看源码思路是一样的。表面上看上去没有问题。

```
 
function destroySelf() {
    const target = data.parent
    if (!target.vLoadingAddClassList) {
      let loadingNumber: number | string | null =
        target.getAttribute('loading-number')
      loadingNumber = Number.parseInt(loadingNumber as any) - 1
      if (!loadingNumber) {
        removeClass(target, 'el-loading-parent--relative')
        target.removeAttribute('loading-number')
      } else {
        target.setAttribute('loading-number', loadingNumber.toString())
      }
      removeClass(target, 'el-loading-parent--hidden')
      vm.$el?.parentNode?.removeChild(vm.$el)
    }
  }
```

 


接下来我们继续 分析 `service.ts`文件，在index.ts 入口文件中，service方式创建 loading 组件其实就是通过 指令的方式。

这里 element-plus 框架几乎每个组件都做了index入口文件处理，统一暴露出 方法 和属性。阅读起来比较思路还时比较清晰的。

```
import { Loading } from './src/service'
import { vLoading } from './src/directive'
import type { App } from 'vue'
// installer and everything in all
export const ElLoading = {
  install(app: App) {
    app.directive('loading', vLoading)
    app.config.globalProperties.$loading = Loading
  },
  directive: vLoading,
  service: Loading,
}
export default ElLoading
export const ElLoadingDirective = vLoading
export const ElLoadingService = Loading
export * from './src/types'
```

service 文件中主要的方法 `Loading`,`resolveOptions`，addStyle，`addClassList`。根据我们灵敏的嗅觉应该直接观察Loading这个方法


![loading-service文件.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1202556b22de46b7bce9eb1a492faa43~tplv-k3u1fbpfcp-watermark.image?)

```
  if (resolved.fullscreen && fullscreenInstance) {
    fullscreenInstance.close()
  }
  const instance = createLoadingComponent({
    ...resolved,
    closed: () => {
      resolved.closed?.()
      if (resolved.fullscreen) fullscreenInstance = undefined
    },
  })
```

根据文档的描述 service 方式创建的loading 是一个全屏的loading，所有这里做了判断 先移除之前的loading，再通过`createLoadingComponent`方法创建一个新的loading组件。所以说道底 核心还是 `createLoadingComponent`,我们再次回到  `loading.ts`文件中。

结合我们的问题大概是 当有多个loading的时候，背景色出现了覆盖。这源码中已经做了判断，先移除 再创建，这个原则是没有问题。

再次点开 close方法，400ms后 调用 `destroySelf` 方法。如果前400ms中，前一个loading组件 虽然调用了close 方法，但还没有调用 `destroySelf` 方法进行移除。后面一个loading组件 就已经开始加载。

```
 //其实问题就出现在这里，当已经有loading 组件应该直接移除
// vm.$el?.parentNode?.removeChild(vm.$el)
if (resolved.fullscreen && fullscreenInstance) {
     vm.$el?.parentNode?.removeChild(vm.$el)
    fullscreenInstance.close()
  }
```

赶紧确认我们的思路，运行后看效果。果然就是这个问题！至此问题才解决了一半。

为什么这么说问题才解决了一半？作为一个主流的开源框架，代码得高大上一点！虽然就是这么一行代码我们也要继续装杯。我们继续回到 `loading.ts`文件中，其实`destroySelf`方法中也出现了重复的代码。

```
// 1。函数的单一原则
// 2。抽取公共代码模块
function remvoeElLoadingChild(): void {
    vm.$el?.parentNode?.removeChild(vm.$el)
  }
```

Ps: 本次修改暂时没有涉及到 `jest` 单元测试相关的修改，`__tests__`文件夹中，spec.ts文件，一般都是针对组件一些的单元测试，如果大家感兴趣我将在后面提交的pr记录进行分享。

至此问题以及修改方案我们已经确认，接下来就是提交pr了。

#### 关于Issue 规范

-   issue 仅用于提交 Bug 或 Feature 以及设计相关的内容，其它内容可能会被直接关闭。如果你在使用时产生了疑问，请到 Slack 或 [Discord](https://discord.link/ElementPlus) 里咨询。
-   在提交 issue 之前，请搜索相关内容是否已被提出。
-   请说明 Element Plus 和 Vue 的版本号，并提供操作系统和浏览器信息。推荐使用 [JSFiddle](https://jsfiddle.net/) 生成在线 demo，这能够更直观地重现问题。

1. 这里我们需要注意的，正常的使用过程中，当你出现一个问题的时候，得先确认别人是否已经提交了相关的issue。所以我们得先根据 element-plus官方的 issue规范 先提交问题待官方确认后你再进行修改。
2. 当有issues 出现后，如果该问题还有进行 milestones , 那么说明该问题以及有人进行 fix，那么你可以分享别人是如何去解决这个问题，如果你有更好的解决方案那么你可以继续提交修改方案。
3. 提高代码质量


![issues确认.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/224b25d6a0bc487ea4653fa230dad1e1~tplv-k3u1fbpfcp-watermark.image?)

4. 接下就是将我们的代码进行 commit 了，在此之前还需要将我们修改的代码 进行`lint`扫描下，温馨提示这一步很重要，因为pr提交后 第一步官方也是进行 扫描、jest 单元测试等。最好不要等到提交后扫描检查失败 再修改。
Ps:其实在我们的日常开发中我们也是遵循问题及早暴露原则， 能在编译中解决的问题，就不要等到运行时再去解决， 能在开发中出现的问题，尽量不要等到提测后再去解决，能在测试阶段解决的问题就不要等到上线后再去解决。

```
pnpm run  lint
```

#### 关于Pull Request 规范

-   commit 信息要以 `type(scope): 描述信息` 的形式填写，例如 `fix(components): [scrollbar] fix xxx bug`。

    1.  type: 必须是 build, chore, ci, docs, feat, fix, perf, refactor, revert, release, style, test, improvement 其中的一个。
    1.  scope: 必须是 components, directives, element-plus, hooks, locale, test-utils, theme-chalk, tokens, utils, project, core, style, docs, ci, dev, build, deploy, other, typography, color, border, var 其中的一个。
    1.  header: 描述信息不要超过 72 个字符。

-   **不要提交** `lib` 里面打包的文件。

-   执行 `npm run build` 后可以正确打包文件。

-   提交 PR 前请 rebase，确保 commit 记录的整洁。

-   确保 PR 是提交到 `dev` 分支，而不是 `master` 分支。

-   如果是修复 bug，请在 PR 中给出描述信息。

这里不得不说下 `commitizen` git 提交规范神器.

```
pnpm cz
```

![pnpm-cz.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0901d24be99040a5b6e8338784bdcbb5~tplv-k3u1fbpfcp-watermark.image?)

因为本次我们是修改的bug，所以我们选择 `fix`，根据提示 提交描述信息 （ps:这里建议大家使用英文进行描述提交，我曾经中文被嫌弃了，继续emo）

push代码到自己的仓库，创建pr 提交出去 就OK啦。

![提交pr.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a2509646bbf49d698bb0dae728576ac~tplv-k3u1fbpfcp-watermark.image?)

#### 最后

-   关于本次提交pr，通过一个简单的 `loading` 组件去阅读框架的源码，分析内部的方法。以及element-plus框架整体的项目结构还时比较清晰的，日常开发中值得我们去借鉴。
-   函数的单一原则，公共代码的封装抽取。
-   `jest` 单元测试（目前已经弃用`Jest`，用`Vitest`）、`commitizen` git 提交规范神器、包括 `eslint` 善于使用工具，提高我们的开发效率。
-   英文的重要性，关于这一点我就不多说了。

    一般情况官方会在三个工作日内fix掉该问题。如果你提交的pr被官方采纳的话，github会有邮件推送，当然基于该问题`author` ，`members` 提出一些他的修改意见，这点很重要。与高手交流从中获取一些的idea。 毕竟解决问题每个人的方法以及角度不同。

Ps:这不评论区已经收到了，官方成员的回复。关于单元测试：`目前已经弃用Jest，用Vitest了`，大家赶紧用起来吧

当然了提交更多pr的话，`Contributors` 也会有排名。目前的话我也挤进前100了，感谢官方的合并，首页也能直接看到头像了哈哈开心~













