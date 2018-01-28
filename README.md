### yuanchat

弹幕收发


##### 安装


```
$ git clone https://github.com/wallaceyuan/danmakuDemo.git
cd node
$ npm install
```


##### 启动命令

```
# 运行客户端
$ npm run app

# 运行服务端
$ npm run client

浏览器打开http://127.0.0.1:3000/ 查看效果
```

##### 依赖redis
```
# windows安装启动
D:\redis
$ redis-server redis.conf

# mac
$ redis-server
或者将redis启动到后台
$ launchctl load ~/Library/LaunchAgents/homebrew.mxcl.redis.plist
```

##### 安装下载项目js

```
# 全局安装bower
$ npm install -g bower

# 安装js依赖
$ bower install
```

##### 前端模板

```
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html',require('ejs').__express);
```

##### 服务器部署

###### PM2

当在内网服务器部署时，推荐使用 [PM2](https://github.com/Unitech/pm2/) 来守护你的应用进程。

###### 全局安装 PM2

```
# 如果有权限要求，记得加 sudo
$ npm install pm2 -g
```

###### 基本描述

#文件目录
```
middleware --接受发送消息模块

task --逻辑处理模块
```

#主要功能
```
接受模块收到消息后 写redis队列 后端逻辑模块从redis队列里面取出 然后发送给发送模块
```

#运行步骤
```
npm install
本地打开redis-server
运行app.js文件
    node app.js
在task文件夹下运行sclient.js
    node sclient.js
在浏览器里访问http://127.0.0.1:3000/
选择命名空间房间看效果
```
