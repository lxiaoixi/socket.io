# Socket.io

> 项目主要使用`express`框架和`socket.io` 搭建，使用`express`的`http`结合`socket.io`服务作为`socket`服务端，使用`socket.io-client`作为`socket`客户端.`socket` 服务端见`socket`目录，主要包括`socket`初始化，`socket`监听事件接收消息，`socket`触发事件发送消息三部分。客户端见`index.ejs`页面，主要包括`socket`客户端的引入，`socket`监听事件接收消息，`socket`触发事件发送消息三部分。

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
        socket.on('message', (data,cb) => {
           console.log(data);
           cb(data);  // 可通过cb回调来告诉客户端收到消息
        })

        // 触发事件 注意服务端触发事件用的是io,可通过添加cb来确认收到数据
        io.emit(eventName, data,[cb]); 
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

## socket多路复用（namespace和room）

> 每个`socket`实例会属于某一个`room`,如果没有指定，那么会有一个`default`的`room`。每个`room`又会属于某个`namespace`，如果没有指定，那么就是默认的`namespace /`。最后`socketio`拥有所有的`namespace`。一个`namespace`可以有多个`room`,一个`room`可以有多个`socket`实例。

> 客户端连接时指定自己属于哪个`namespace`, 也可以不指定默认为 `/`,如下有两个`namespace`,`/chat`和`/news`,服务端看到`chat`就会把这个`socket`实例加入`chat`的`namespace`，而`news`的`socket`实例服务端会将其加入`news`的`namespace`.

> `io.of('namespace').in('room')`   `namespace`用`of`指定，`room`用`in/to`指定.

客户端代码：

```
     var chat = io('http://localhost/chat')
    , news = io('http://localhost/news');
  
    chat.on('connect', function () {
        chat.emit('hi!');
    });
    
    news.on('news', function () {
        news.emit('woot');
    });

```
服务端代码：

```
    const io = require('socket.io')(server);

    // Socket namespace :/chat 和 /news
    var chat = io
        .of('/chat')
        .on('connection', function (socket) {
            socket.emit('a message', {
                that: 'only'
            , '/chat': 'will get'
            });
            chat.emit('a message', {
                everyone: 'in'
            , '/chat': 'will get'
            });
        });

    var news = io
        .of('/news')
        .on('connection', function (socket) {
            socket.emit('item', { news: 'item' });
        });

```

> Room. 房间，频道；socket实例可以加入或离开room.该功能可实现分组，分组群聊或推送消息,分组统计在线人数等功能。
每个socket实例都以socket.id为唯一标识，默认每个socket实例都加入以socket.id为名的room。

```
    // 加入或离开room
    io.on('connection', function(socket){
        socket.join('some room');  // socket.leave('some room'); 
    });

    //使用in/to向某个room里的所有socket实例发送消息  
    io.in('roomName').emit('eventName',data);

     // 统计namespace为chat的room为room1房间当前在线人数，也可只统计某个namespace的人数
    io.of('/chat').in('room1').clients((error, clients) => {
        if (error) throw error;
        console.log('8888888888888');
        console.log(clients); // => [Anw2LatarvGVVXEIAAAD]
    });

```

## 目前项目实现的功能

1.随机设置用户昵称
2.用户上线通知
3.用户下线通知
4.群聊
5.统计在线人数
6.添加namespace和room

## 注意

* io.emit(eventName, data);  // send an event to everyone 该事件会通知所有监听该事件人，包括当前用户
* socket.broadcast.emit(eventName, data); // send a message to everyone except for a certain socket  不包括当前用户


## 参考

* https://socket.io/get-started/chat/
* https://socket.io/docs/
* https://socket.io/docs/server-api/（server api）
* https://socket.io/docs/client-api/(client api)