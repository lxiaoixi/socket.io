# Socket.io

> 项目主要使用`express`框架和`socket.io` 搭建，使用`express`的`http`结合`socket.io`服务作为`socket`服务端，使用`socket.io-client`作为`socket`客户端.`socket` 服务端见项目`socket`目录，主要包括`socket`初始化，`socket`监听事件接收消息，`socket`触发事件发送消息三部分。客户端见项目`index.ejs`页面，主要包括`socket`客户端的引入，`socket`监听事件接收消息，`socket`触发事件发送消息三部分。

## 主要技术

* node-express
* socket.io

## 服务端 引入Socket.io

* npm install --save socket.io

```
    var app = require('express')();
    var http = require('http');
    var server = http.createServer(app);
    
    const io = require('socket.io')(server, [options]);

    io.on('connection', function(socket){
        console.log('a user connected');

        // 监听事件 socket.on(eventName,callback(data))
        socket.on('message', (data,cb) => {
           console.log(data);
           cb(data);  // 可通过cb回调来告诉客户端成功收到消息
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
        var socket = io(url, [options]);

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

## handshake 

> 可通过handshake 来获取客户端在连接时传的参数。

client 端 两种传参方式：

* With query parameters

```
let socket = io('http://localhost:3000/chat?name=xiaoxi');
```

* With query option

```
let socket = io('http://localhost:3000/chat',{
    query: {
        name: 'xiaoxi'
    }
});
```

* With extraHeaders 请求头

```
let socket = io('http://localhost:3000/chat',{
    transportOptions: {
        polling: {
            extraHeaders: {
                'x-clientid': 'abc'
            }
        }
    }
});

```

服务端通过`handshake`获取参数：

```
    // 获取请求参数
    let handshake = socket.handshake;
    let name = handshake.query.name;

    // 获取请求头
    let clientId = handshake.headers['x-clientid'];

```


## socket多路复用（namespace和room）

![alt text](./public/img/socket_namespace_room.png)

> socket实例 → room → namespace。

> 每个`socket`实例会属于某一个`room`,如果没有指定，那么会有一个`default`的`room`。每个`room`又会属于某个`namespace`，如果没有指定，那么就是默认的`namespace /`。最后`socketio`拥有所有的`namespace`。一个`namespace`可以有多个`room`,一个`room`可以有多个`socket`实例。

> 客户端连接时指定自己属于哪个`namespace`, 也可以不指定默认为 `/`,如下有两个`namespace`,`/chat`和`/news`,服务端看到`chat`就会把这个`socket`实例加入`chat`的`namespace`，而`news`的`socket`实例服务端会将其加入`news`的`namespace`.


客户端代码：

```
     var chat = io('http://localhost:3000/chat')
    , news = io('http://localhost:3000/news');
  
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
                that: 'only',
                '/chat': 'will get'
            });
            chat.emit('a message', {
                everyone: 'in',
                '/chat': 'will get'
            });
        });

    var news = io
        .of('/news')
        .on('connection', function (socket) {
            socket.emit('item', { news: 'item' });
        });

```

> Room. 房间，频道；socket实例可以加入或离开room.该功能可实现分组，分组群聊或分组推送消息,分组统计在线人数等功能。每个socket实例都以socket.id为唯一标识，如果不指定room,默认每个socket实例都加入以socket.id为名的room。

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

> `io.of('namespace').in('room')`   `namespace`用`of`指定，`room`用`in/to`指定.

## 同时指定namespace和服务端path

```
服务端socket连接地址, 指定socket的path为'/socket'  http://127.0.0.1:5021/socket

const io = require('socket.io')(server, {
  path: '/socket'
});

// Socket namespace :/chat
var chat = io
        .of('/chat')
        .on('connection', function (socket) {
            socket.emit('a message', {
                that: 'only',
                '/chat': 'will get'
            });
            chat.emit('a message', {
                everyone: 'in',
                '/chat': 'will get'
            });
        });

客户端在连接服务端时，指定namespace为chat
const socket = io('http://127.0.0.1:5021/chat', {
  path: '/socket'
});


// the socket connects to the chat namespace, with the custom path socket.
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

* 所有广播都是广播给这个socket所属的 namespace里的所有客户端。只有跟socket同一个namespace里的客户端才能收到数据。


## 参考

* https://socket.io/get-started/chat/
* https://socket.io/docs/
* https://socket.io/docs/server-api/ (server api)
* https://socket.io/docs/client-api/ (client api)
* https://blog.csdn.net/lijiecong/article/details/50781417 (namespace和room)