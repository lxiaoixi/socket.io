# Socket.io

> 项目主要使用express框架和socket.io 搭建，使用express的http结合socket.io服务作为socket服务端，使用socket.io-client作为socket客户端.socket 服务端见socket目录，主要包括socket初始化，socket监听事件接收消息，socket触发事件发送消息三部分。客户端见index.ejs页面，主要包括socket客户端的引入，socket监听事件接收消息，socket触发事件发送消息三部分。

## 主要技术

* node-express
* socket.io

## 服务端 引入Socket.io

* npm install --save socket.io

```
    var app = require('express')();
    var http = require('http');
    var server = http.createServer(app);
    const io = require('socket.io')(server);

    io.on('connection', function(socket){
        console.log('a user connected');

        // 监听事件 socket.on(eventName,callback(data))
        socket.on('message', data => {
           console.log(data);
        })

        // 触发事件 注意服务端触发事件用的是io
        io.emit(eventName, data); 
    });

```

## 客户端引入 Socket.io

* npm install --save socket.io-client

```
    <script src="/socket.io/socket.io.js"></script>
    <script>
        var socket = io();

        // 监听事件 socket.on(eventName,callback(data))
        socket.on('user_connect', data =>{
            console.log('a user connect');
            console.log(data);
        })

        // 触发事件socket.emit(eventName,data)
        socket.emit('message',{
            event:'chat_message',
            msg:$('#m').val()
        });
    </script>


```


## 目前项目实现的功能

1.随机设置用户昵称
2.用户上线通知
3.用户下线通知
4.群聊
5.统计在线人数

## 注意

* io.emit(eventName, data);  // send an event to everyone 该事件会通知所有监听该事件人，包括当前用户
* socket.broadcast.emit(eventName, data); // send a message to everyone except for a certain socket  不包括当前用户


## 参考

* https://socket.io/get-started/chat/