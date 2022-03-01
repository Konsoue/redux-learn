# 自学 redux 源码

在学习 redux 源码的过程中，我尽量精简了代码。
1. 源码中有许多的错误类型判断，我删除了很多
2. 有一些代码删除不影响基本功能，我删除了。比如 warning.js、symbol-observable.js 等

## 使用方式

1. src 文件夹是手撕 redux 的代码
2. test 文件夹是对手写的 redux 的测试代码
3. 运行命令 `npm run build`，对源码进行打包编译，不然 node 环境不支持 ES6 的 import 语法


