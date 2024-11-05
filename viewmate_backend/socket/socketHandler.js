const socketHandler = (io) => {
  // 채팅방 목록
  const rooms = ['room1', 'room2', 'room3'];

  // 각 채팅방에 대한 네임스페이스 설정
  rooms.forEach(room => {
    const namespace = io.of(`/${room}`);
    
    namespace.on('connection', (socket) => {
      console.log(`${room}에 클라이언트가 연결되었습니다:`, socket.id);
      
      // 메시지 이벤트 처리
      socket.on('sendMessage', (msg) => {
        console.log(`[${room}] 받은 메시지:`, msg);
        namespace.emit('receiveMessage', msg);
      });
      
      // 연결 끊김 처리
      socket.on('disconnect', () => {
        console.log(`${room} 클라이언트가 연결을 끊었습니다:`, socket.id);
      });
    });
  });
};

module.exports = socketHandler; 