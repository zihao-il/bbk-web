# bbk-web

## 说明

如需要静态版请把`src/utils/request.js`中`baseURL`取消注释再进行打包或者下载`dist-static.zip`文件

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

nginx反向代理简单举例（静态版不需要）

```bash
    ...
    
    gzip  on;
    server {
        listen       80;
        server_name  localhost;

        location / {
            root   html;
            index  index.html index.htm;
            try_files $uri $uri/ /index.html;
        }
        
        location /api {
            proxy_pass http://bbk.endyun.ltd:9000/api; 
        }
        
        ...

```

## 参考页面

[https://bbk.endyun.ltd/download](https://bbk.endyun.ltd/download)

## 其他说明

如需要html文件放二级目录，请修改`vite.config.js`文件中的`base`的值后重新打包  
例如你的想在`127.0.0.1/mc`域名下访问，请修改`base`的值为`/mc`



