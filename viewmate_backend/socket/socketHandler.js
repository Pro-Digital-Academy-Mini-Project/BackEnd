const socketHandler = (io) => {
  // 활성화된 룸을 추적하기 위한 Set 생성
  const activeRooms = new Set();

  io.on('connection', (socket) => {
    console.log('새로운 클라이언트가 연결되었습니다:', socket.id);

    // 룸 참가 요청 처리
    socket.on('joinRoom', (roomId) => {
      console.log(`클라이언트 ${socket.id}가 룸 ${roomId}에 참가 요청`);
      
      // 새로운 룸이면 Set에 추가
      if (!activeRooms.has(roomId)) {
        activeRooms.add(roomId);
      }
      
      // 해당 룸에 참가
      socket.join(roomId);
      
      // 룸 참가 알림
      io.to(roomId).emit('receiveMessage', `새로운 사용자가 입장했습니다: ${socket.id}`);
    });

    // 메시지 전송 처리
    socket.on('sendMessage', (msg) => {
      // 현재 소켓이 속한 모든 룸을 가져옴
      const rooms = Array.from(socket.rooms);
      // Set에서 첫 번째 값은 항상 socket.id이므로 제외하고 두 번째 값(실제 룸)을 사용
      const currentRoom = rooms[1];
      
      if (currentRoom) {
        console.log(`[${currentRoom}] 받은 메시지:`, msg);
        io.to(currentRoom).emit('receiveMessage', msg);
      }
    });

    // 룸 나가기 처리
    socket.on('leaveRoom', (roomId) => {
      socket.leave(roomId);
      console.log(`클라이언트 ${socket.id}가 룸 ${roomId}에서 나갔습니다`);
      io.to(roomId).emit('receiveMessage', `사용자가 퇴장했습니다: ${socket.id}`);
      
      // 해당 룸에 아무도 없으면 activeRooms에서 제거
      const room = io.sockets.adapter.rooms.get(roomId);
      if (!room) {
        activeRooms.delete(roomId);
        console.log(`룸 ${roomId}가 비어있어 제거되었습니다`);
      }
    });
    
    // 연결 끊김 처리
    socket.on('disconnect', () => {
      console.log('클라이언트가 연결을 끊었습니다:', socket.id);
    });
  });
};

module.exports = socketHandler; 