const app = () => {
  const socket = io('https://chat-lr5h.onrender.com');
  const msgInput = document.querySelector('.message-input');
  const msgList = document.querySelector('.messages-list');
  const sendBtn = document.querySelector('.send-btn');
  const usernameInput = document.querySelector('.username-input');
  const messages = [];

  const getMessages = async () => {
    try {
      const { data } = await axios.get('https://chat-lr5h.onrender.com/api/chat');

      renderMessages(data);
      
      data.forEach((item) => messages.push(item));
    } catch (error) {
      console.log(error.message);
    }
  };

  getMessages();

  const handleSendMessage = (text) => {
    if (!text.trim()) {
      return;
    }

    sendMessage({
      username: usernameInput.value || 'Anonymous',
      text,
      createdAt: new Date(),
    });

    msgInput.value = '';
  };

  msgInput.addEventListener(
    'keydown',
    (e) => e.keyCode === 13 && handleSendMessage(e.target.value),
  );

  sendBtn.addEventListener('click', () => handleSendMessage(msgInput.value));
  

    const renderMessages = (data) => {
    let messages = '';
    
    data.forEach(
      (message) =>
        (messages += `
        <li class="bg-dark p-2 rounded mb-2 d-flex justify-content-between message">
            <div class="mr-2">
                <span class="text-info">${message.username}</span>
                <p class="text-light">${message.text}</p>
                <a class="delete-btn" block_num=${message.id}>Удалить</a>
            </div>
            <span class="text-muted text-right date">
                ${new Date(message.createdAt).toLocaleString('ru', {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                })}
            </span>
        </li>`),
    );
        //console.log(messages);
        
      msgList.innerHTML = messages;

      
      const deleteBtns = document.querySelectorAll('.delete-btn');

      deleteBtns.forEach((deleteBtn) => {
        deleteBtn.addEventListener('click', () => {
          const blockNum = deleteBtn.getAttribute('block_num');
         
          //socket.emit('deleteMessage', parseInt(blockNum));
          
          deleteMessage(parseInt(blockNum)).then(() => {
          //deleteBtn.parentNode.parentNode.remove();  
    // Once the deleteMessage operation is completed, remove the corresponding message from the DOM
    const messageToRemove = msgList.querySelector(`[block_num="${blockNum}"]`);
    if (messageToRemove) {
      messageToRemove.parentElement.parentElement.remove(); // Assuming the <li> element is the parent's parent
      messages = msgList.innerHTML;
    }
});
        });
});

  };
  
  const deleteMessage = async (id) => { 
   // try {
    socket.emit('deleteMessage', parseInt(id));
    
  //  }
  //  catch { 
  //    console.log("Error");
  //  }
  }
    const sendMessage = (message) => socket.emit('sendMessage', message);

  socket.on('recMessage', (message) => {
    getMessages();
    messages.push(message);
    renderMessages(messages);
  });
    
  //const deleteMessage = (message) => socket.emit('deleteMessage', 1);
    
};

app();
