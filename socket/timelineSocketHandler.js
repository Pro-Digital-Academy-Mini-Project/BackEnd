const socketHandler = (io) => {
  const activeRooms = new Set();

  io.on('connection', (socket) => {
    console.log('새로운 클라이언트가 연결되었습니다:', socket.id);

    socket.on('joinTimeLineRoom', (roomId) => {
      console.log(`클라이언트 ${socket.id}가 타임라인 룸 ${roomId}에 참가 요청`);
      
      if (!socket.rooms.has(roomId)) {
        if (!activeRooms.has(roomId)) {
          activeRooms.add(roomId);
        }
        
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('receiveTimeLineMessage', 
          `새로운 사용자가 입장했습니다: ${socket.id}`
        );
      }
    });

    socket.on('sendTimeLineMessage', (data) => {
      const { roomId, message, timestamp } = data;
      console.log("sendTimeLineMessage");
      console.log(`[${roomId}] 메시지:`, message);
      io.to(roomId).emit('receiveTimeLineMessage', {
        username: "testuser",
        roomId: `${roomId}`,
        message: `${message}`,
        timestamp: `${timestamp}`,
      });
    });

    socket.on('leaveTimeLineRoom', (roomId) => {
      socket.leave(roomId);
      console.log(`클라이언트 ${socket.id}가 타임라인 룸 ${roomId}에서 나갔습니다`);
      io.to(roomId).emit('receiveTimeLineMessage', 
        `사용자가 퇴장했습니다: ${socket.id}`
      );
      
      const room = io.sockets.adapter.rooms.get(roomId);
      if (!room) {
        activeRooms.delete(roomId);
        console.log(`룸 ${roomId}가 비어있어 제거되었습니다`);
      }
    });
    
    socket.on('disconnect', () => {
      console.log('클라이언트가 연결을 끊었습니다:', socket.id);
    });
  });
};

module.exports = socketHandler; 