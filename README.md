# bbk-web

## 构建方法

首先运行下面命令安装库

```bash
npm install
```

运行下面代码打包网页

```bash
npm run build
```

nginx配置简单举例

```bash
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


