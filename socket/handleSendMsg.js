let _io = null;

const initSendIo = (io) => {
    _io = io;
}

const handleSendMsg = (event, data, socket, isBroad) => {
    data.socket_id = socket.id; // socketid 唯一标识一个客户
    data.nickname = socket.nickname;
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