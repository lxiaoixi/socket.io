let _io = null;

const initSendIo = {

    chatIo: null,
    newsIo: null,
    initChatIo(io) {
        this.chatIo = io;
    },
    initNewsIo(io) {
        this.newsIo = io;
    }
}

// 发送消息
const handleSendMsg = (event, data, socket, isBroad, io_namespace) => {
    let _io = initSendIo[io_namespace];
    data.socket_id = socket.id; // socketid 唯一标识一个客户
    data.nickname = socket.nickname || '';
    console.log(data);
    if (isBroad) {
        socket.broadcast.emit(event, data); // 将该消息广播通知所有人，不包括当前用户
    } else {
        _io.emit(event, data); // 将该消息广播通知所有人，包括当前用户
    }

}

module.exports = {
    handleSendMsg,
    initSendIo
}