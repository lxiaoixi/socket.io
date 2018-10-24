const { handleReceiveMsg } = require('./handleReceiveMsg');
const { initIo, handleSendMsg } = require('./handleSendMsg');
const { getName } = require('../config/generateName');
let count = 0; // 统计在线人数，连接加1断开减1

// 初始化socket
const socketInit = (server) => {
    const io = require('socket.io')(server);

    // Socket namespace :/chat 和 /news

    chatSocketInit(io);
    newsSocketInit(io);
}


// chat namespace
const chatSocketInit = (io) => {
    const chat =
        io
        .of('/chat') //指定namespace
        .on('connection', socket => {

            chatSocketObj.connectHandler(socket);

            // 监听socket断开连接事件
            socket.on('disconnect', () => {
                chatSocketObj.disconnectHandler(socket, io);
            })

        })

    // 初始化chat namespace发送模块
    initIo.initChatIo(chat);
}

// news namespace
const newsSocketInit = (io) => {
    const news = io
        .of('/news')
        .on('connection', function(socket) {
            console.log('this is news namespace');
            newsSocketObj.connectHandler(socket);
            // 监听socket断开连接事件
            socket.on('disconnect', () => {
                newsSocketObj.disconnectHandler(socket);
            })
        });
    // 初始化news namespace发送模块
    initIo.initNewsIo(news);
}

const chatSocketObj = {
    // 连接
    connectHandler(socket) {
        console.log('a user connected', socket.id);
        socket.join('room1'); // 加入room1房间
        count++;
        // 设置用户昵称 
        socket.nickname = getName();
        handleSendMsg('user_connect', {
            msg: 'come in',
            count: count
        }, socket, false, 'chatIo');

        // 监听message事件，接受客户端发来的消息data
        socket.on('message', (data, cb) => {
            // 对事件根据不同的event进行不同的处理
            let msg = handleReceiveMsg(data, socket);
            cb(msg);
        })
    },

    // 断开连接
    disconnectHandler(socket, io) {
        console.log('a user disconnected', socket.id);
        socket.leave('room1'); // 离开room1房间
        count--;
        handleSendMsg('user_disconnected', {
            msg: 'leave out',
            count: count
        }, socket, false, 'chatIo');

        // 统计room1房间当前在线人数，可以将当前房间人数发送给客户端
        io.of('/chat').in('room1').clients((error, clients) => {
            if (error) throw error;
            console.log('8888888888888');
            console.log(clients); // => [Anw2LatarvGVVXEIAAAD]
        });
    }
}

const newsSocketObj = {
    // 连接
    connectHandler(socket) {
        console.log('news socket user connected', socket.id);
        handleSendMsg('item', {
            news: 'this is news namespace'
        }, socket, false, 'newsIo');

        // 监听message事件，接受客户端发来的消息data
        socket.on('message', (data, cb) => {
            // 对事件根据不同的event进行不同的处理
            let msg = handleReceiveMsg(data, socket);
            cb(msg);
        })
    },

    // 断开连接
    disconnectHandler(socket) {
        console.log('news socket user disconnected', socket.id);
    }
}


module.exports = {
    socketInit
}