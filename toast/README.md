# READ ME

## 项目介绍

自制屏幕上方居中提示组件（Toast），效果模仿 antd 的 Message 组件（简略版）。

### 安装的库

``` shell
# 图标库
npm i --save @fortawesome/fontawesome-svg-core
npm i --save @fortawesome/free-solid-svg-icons
npm i --save @fortawesome/react-fontawesome@latest
```

所有库

``` shell
├── @eslint/js@9.39.2
├── @fortawesome/fontawesome-svg-core@7.1.0
├── @fortawesome/free-solid-svg-icons@7.1.0
├── @fortawesome/react-fontawesome@3.1.1
├── @types/react-dom@19.2.3
├── @types/react@19.2.9
├── @vitejs/plugin-react@5.1.2
├── eslint-plugin-react-hooks@7.0.1
├── eslint-plugin-react-refresh@0.4.26
├── eslint@9.39.2
├── globals@16.5.0
├── react-dom@19.2.3
├── react@19.2.3
└── vite@7.3.1
```

### 运行

``` shell
cd toast
npm run dev
```

### 项目技术

已知 Message 会有多条，Message 种类不多就五种：loading、success、info、warning、error，所以使用列表存储每条 Message，即 messageQueue。使用对象来存储每条 Message 的属性（提示文本 content、种类 type、提示多久后自动消失 duration 等）。

显然可以作成两个组件：ToastList 和 Toast，ToastList 负责所有 Message，Toast 则负责单条 Message。

Message 数据会来自不同的组件（这些组件是数据的提供者 Provider），然后汇聚到 ToastList 进行展示，messageQueue 的声明必须在所有需要提示消息的组件的父组件中，然后作为数据的消费者（Consumer）的 ToastList 组件的位置是未知的，有可能会在很深的子组件中，所以使用  上下文 来存储消息数据数组。上下文的作用使参数不再作为 props 一层层在组件中传递，而是在需要用到的组件处直接获得。

因此，本项目的用法：ToastProvider 组件需要包裹所有提供提示消息数据的组件，同时将 messageQueue 声明在 ToastProvider 中。在希望展示 Message 处调用 `useMessageContext()` 获取 `addMessage` 方法，向 `addMessage` 方法传递新增提示消息数据。

> 上下文本质：避免参数传递到不需要用到的子组件中使得该子组件只是个传声筒。上下文有两个组件：数据的提供者 Provider 和 数据的消费者 Consumer。创建上下文用 createContext，获取上下文中的数据用 useContext。

> 关于详细的 useContext 用法可以参考 React学习手册（第二版）153页 6.6 React 上下文
>
> 这本书也有一个例子，通俗易懂。代码有需要改动的地方，所以不可全信😑，都是一眼可以看出来的，如果解决不了可以看看我遇到的坑，说不定有😃。

希望 Toast 组件拥有进入和退出动画，这样不会太突兀，那么这就涉及到等待一段时间后播放退出动画，在 messageQueue 中删除当前 Message。所以这里用到了 useEffect 钩子。用了两个，第一个是用来播放退出动画，即改变 Toast 组件的 className，第二个是等待退出动画播放完成后删除 Message。

> useEffect 和 useState 很容易搞混，我觉得它们的区别就是 useState 是用来存数据的，而 useEffect 是需要做一些事情，这些事情不能通过改变 useState 来实现的。例如：等待一段时间后执行某些事，页面加载完成后需要请求数据，组件写在清理资源等。

图标来自 `fortawesome` 库，免费版有 3 种图标库，这里只用了 solid。使用前需要先将图标导入到 `library` 中，如下所示，这是免费版方法。当然还有其他方法似乎需要安装一个工具包，否则显示不出。这个工具包说是用 Pro 版本必须装，对于我这穷逼来说还是算了😂，所以没试。`fas` 是导入所有 solid 图标，还可以单独到导入要使用的图标，见官网吧。

``` react
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
// 导入图标库
library.add(fas);
```

官方网址：https://fontawesome.com/

#### 遇到的坑

##### 同时导出上下文与组件

上下文与组件可以写在同一个文件种，也可以在同一个文件中导出。当它们在同一个文件中导出会影响到 react 的热更新。此时 eslint 会提示：

`Fast refresh only works when a file only exports components. Move your React context(s) to a separate file.` 

翻译：

`Fast Refresh（快速热更新）只能在一个文件“只导出 React 组件”的情况下正常工作。
 请把你的 React Context（上下文）移动到单独的文件中。`。

所以要将它们分开。

`MessageContext` 和 `useMessageContext` 是可以放在一起的（试过了），只是我将它们分开了。但是它们和 `ToastProvider` 放在一起时 eslint 会提示。

不管 eslint 的提示程序也可以跑（试过了）。

我看到还有一种导出方法，不要把 `export` 卸载前面，而是在文件最后 `export { useMessageContext, ToastProvider }`，不过这种方法我没有试过，不确定是否会有 eslint 提示。

##### map 中的箭头函数

map 用了 `{}`（函数体）必须手动 `return`。没用 `{}`（表达式体）自动 `return`。

错误展示：

``` react
list.map(item => {
  <div>{item}</div>
})
```

会得到 `[undefined]`。哇，我就是这样写困扰了我两天（还好不是实的，大部分时间都在打游戏😃），翻了五六遍上下文🤪以为自己漏看了或者没看会。

##### 不要在 useEffect 中修改上下文的值

最开始我将 Toast 的状态也记在了上下文中，就会有弹出 Toast，但是不会退出。这是因为改变了上下文的值，上下文会通知 Toast 组件刷新，组件刷新会删除原组件再生成一个此时会执行 useEffect 组件中的 return 方法于是 timer 就被删除了。自然就不会退出了。

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
