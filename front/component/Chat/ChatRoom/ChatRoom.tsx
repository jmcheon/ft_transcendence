const ChatRoom = () => {
  const addChat = () => {
    console.log('add chat')
  }
  return (
    <div className="ChatRoom">
      <div className="chat-div">
        <h1>CHAT ROOM</h1>
        
        <button onClick={addChat}>+</button>
      </div>
      <hr />
      <ul>
        <li>chat room 1</li>
        <li>chat room 2</li>
        <li>chat room 3</li>
      </ul>
      <style jsx>{`

        button {
          background-color: white; 
          border-style: none;
          cursor: pointer
        }

        .ChatRoom {
          height: 410px;
        }

        .chat-div {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 5px;
        }
      `}</style>
    </div>
  );
};

export default ChatRoom;
