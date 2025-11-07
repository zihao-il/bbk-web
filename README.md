# bbk-web

## 说明

所有语言都是使用谷歌翻译，如果翻译有问题请修改`src/lang/src`中的文件

## 参考页面

[https://bbk.endyun.ltd/download](https://bbk.endyun.ltd/download)

## 演示地址

[https://a.endyun.ltd/](https://a.endyun.ltd/) 由netlify托管

## 构建方法

你需要安装[nodejs](https://nodejs.org/)

首先运行下面命令安装库

```bash
npm install
```

打包网页：

```bash
npm run build
```

预览项目：

```bash
npm run dev
```

预览打包效果：

```bash
npm run preview
```

## 其他说明

如需要html文件放二级目录，请修改`vite.config.js`文件中的`base`的值后重新打包  
例如你的想在`127.0.0.1/mc`域名下访问，请修改`base`的值为`/mc`



