const { handleReceiveMsg } = require('./handleReceiveMsg');
const { initSendIo, handleSendMsg } = require('./handleSendMsg');
const { getName } = require('../config/generateName');
let count = 0;

// 初始化socket
const socketInit = (server) => {
    const io = require('socket.io')(server);

    const chat = io.of('/chat')
        .on('connection', socket => {

            connectHandler(socket);
            // 监听socket断开连接事件
            socket.on('disconnect', () => {
                disconnectHandler(socket, io);
            })
        })

    const news = io
        .of('/news')
        .on('connection', function(socket) {
            console.log('this is news namespace');
            socket.emit('item', {
                news: 'item'
            });
        });

    // 监听socket连接事件
    // io.on('connection', socket => {

    //     connectHandler(socket);
    //     // 监听socket断开连接事件
    //     socket.on('disconnect', () => {
    //         disconnectHandler(socket, io);
    //     })
    // })

    // 初始化发送模块
    initSendIo(chat);
}

// 连接
const connectHandler = (socket) => {
    console.log('a user connected', socket.id);
    count++;
    // 设置用户昵称
    socket.nickname = getName();
    handleSendMsg('user_connect', { msg: 'come in', count: count }, socket, false);

    // 监听message事件，接受客户端发来的消息data
    socket.on('message', data => {
        // 对事件根据不同的event进行不同的处理
        handleReceiveMsg(data, socket);
    })
}

// 断开连接
const disconnectHandler = (socket) => {
    console.log('a user disconnected', socket.id);
    count--;
    handleSendMsg('user_disconnected', { msg: 'leave out', count: count }, socket, false);
}



module.exports = {
    socketInit
}