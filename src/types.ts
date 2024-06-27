export interface Message {
    id: string;
    botName: string;
    avatar: string;
    content: string;
    date: string;
    sender: 'user' | 'bot';
  }
  
  export interface Bot {
    name: string;
    avatar: string;
    actions: Record<string, (message: string) => Promise<string>>;
  }
  
  export interface ChatState {
    messages: Message[];
    bots: Bot[];
  }