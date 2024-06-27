import './style.css';
import { bots } from './bots';
import { Message, ChatState } from './types';
import { getFormattedDate } from './utils/dateUtils';

const state: ChatState = {
  messages: JSON.parse(localStorage.getItem('messages') || '[]'),
  bots,
};

const messageContainer = document.getElementById('message-container')!;
const inputField = document.getElementById('message-input') as HTMLInputElement;
const sendButton = document.getElementById('send-button')!;
const botList = document.getElementById('bot-list')!;

const renderBots = () => {
  botList.innerHTML = '';
  state.bots.forEach(bot => {
    const botItem = document.createElement('li');
    const botProfilePic = document.createElement('img');
    
    botItem.className = 'bot-list-item';
    botItem.textContent = bot.name;
    
    botProfilePic.className = 'bot-list-item-avatar';
    botProfilePic.src = bot.avatar;
    botProfilePic.alt = bot.name;
    botItem.insertBefore(botProfilePic, botItem.firstChild);
    botList.appendChild(botItem);
  });
};

// render all the messages present in the state 
const renderMessages = () => {
  messageContainer.innerHTML = '';
  state.messages.forEach(message => {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`;
    messageElement.innerHTML = `
    ${message.sender !== 'user' ? `<img src="${message.avatar}" alt="${message.botName}" />` : ''}
    <div>
      <div>${message.content}</div>
      ${message.sender !== 'user' ? `<div class="message-timestamp">${message.date}</div>` : ''}
    </div>
  `;
    messageContainer.appendChild(messageElement);
  });
  messageContainer.scrollTop = messageContainer.scrollHeight;
};


const sendMessage = async (content: string) => {
  const userMessage: Message = {
    id: Math.random().toString(36).substr(2, 9), // replace substr by substring(2)
    botName: 'User',
    avatar: 'user.png',
    content,
    date: getFormattedDate(),
    sender: 'user',
  };
  state.messages.push(userMessage);
  renderMessages();
  localStorage.setItem('messages', JSON.stringify(state.messages));

  // split the content into command and arguments
  const [command, ...args] = content.toLowerCase().split(' ');

  // find the bots that can handle the command
  const botsWithCommand = bots.filter(b => Object.keys(b.actions).includes(command));

  if (botsWithCommand.length > 0) {
    for (const bot of botsWithCommand) {
      
      const responseContent = await bot.actions[command](args.join(' '));
      
      const botMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        botName: bot.name,
        avatar: bot.avatar,
        content: responseContent,
        date: getFormattedDate(),
        sender: 'bot',
      };
      state.messages.push(botMessage);
      localStorage.setItem('messages', JSON.stringify(state.messages));
    }
    renderMessages();
  }
};

sendButton.addEventListener('click', () => {
  if (inputField.value.trim()) {
    sendMessage(inputField.value.trim());
    inputField.value = '';
  }
});

inputField.addEventListener('keypress', (event) => {
  if (event.key === 'Enter' && inputField.value.trim()) {
    sendMessage(inputField.value.trim());
    inputField.value = '';
  }
});

renderBots();
renderMessages();
