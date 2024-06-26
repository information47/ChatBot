// import './style.css'
// import typescriptLogo from './typescript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.ts'

// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
//   <div>
//     <a href="https://vitejs.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://www.typescriptlang.org/" target="_blank">
//       <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
//     </a>
//     <h1>Vite + TypeScript</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite and TypeScript logos to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

import './style.css';
import { bots } from './bots';
import { Message, ChatState } from './types';

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
    timestamp: new Date(),
    sender: 'user',
  };
  state.messages.push(userMessage);
  renderMessages();
  localStorage.setItem('messages', JSON.stringify(state.messages));

  // split the content into command and arguments
  const [command, ...args] = content.split(' ');

  // find the bot that can handle the command
  const bot = bots.find(b => Object.keys(b.actions).includes(command));
  
  if (bot) {
    // call the function associated with the command and pass the arguments
    const responseContent = await bot.actions[command](args.join(' '));
    
    const botMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      botName: bot.name,
      avatar: bot.avatar,
      content: responseContent,
      timestamp: new Date(),
      sender: 'bot',
    };
    state.messages.push(botMessage);
    renderMessages();
    localStorage.setItem('messages', JSON.stringify(state.messages));
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
