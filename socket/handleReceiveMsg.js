const { handleSendMsg } = require('./handleSendMsg');

const handleReceiveMsg = (data, socket) => {
    switch (data.event) {
        case 'chat_message':
            console.log('receive chat message: ' + JSON.stringify(data), socket.id);
            handleSendMsg('chat_message', data, socket, false);
            break;
        default:
            break;
    }
}


module.exports = {
    handleReceiveMsg
}