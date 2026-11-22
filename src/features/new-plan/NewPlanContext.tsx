import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { BackHandler, type TextInput } from 'react-native';

export type ChatMessage = {
  id: string;
  from: 'user' | 'assistant';
  text: string;
  // Shown under the user's messages, e.g. "10:30 PM".
  time?: string;
};

// There's no assistant yet: every message gets this reply.
const ASSISTANT_REPLY = 'hi lol';
// The reply arrives once the user's message has finished revealing (1s).
const REPLY_DELAY_MS = 1000;

// "New Plan" mode: starts when the nav bar's trip input is focused and lasts
// until it's closed with X (or Android's back button). Hiding the keyboard
// doesn't end it. While it's on, pages show the New Plan header and the chat,
// and the nav bar's tab buttons are put away.
type NewPlanContextValue = {
  active: boolean;
  messages: ChatMessage[];
  // What's typed in the nav bar's input, not yet sent.
  draft: string;
  setDraft: (text: string) => void;
  start: () => void;
  send: (text: string) => void;
  close: () => void;
  inputRef: RefObject<TextInput | null>;
};

const NewPlanContext = createContext<NewPlanContextValue | null>(null);

function timeLabel(date: Date) {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours % 12 || 12}:${minutes} ${hours < 12 ? 'AM' : 'PM'}`;
}

export function NewPlanProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<TextInput>(null);
  const replyTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const nextId = useRef(0);

  const start = () => setActive(true);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const message = (from: ChatMessage['from'], body: string, time?: string): ChatMessage => ({
      id: String(nextId.current++),
      from,
      text: body,
      time,
    });
    setMessages((prev) => [...prev, message('user', trimmed, timeLabel(new Date()))]);
    replyTimers.current.push(
      setTimeout(() => setMessages((prev) => [...prev, message('assistant', ASSISTANT_REPLY)]), REPLY_DELAY_MS),
    );
  };

  // Closing a New Plan discards it: the next one starts with an empty chat.
  const close = () => {
    inputRef.current?.blur();
    replyTimers.current.forEach(clearTimeout);
    replyTimers.current = [];
    setMessages([]);
    setDraft('');
    setActive(false);
  };

  // With the tab buttons put away, back leaves New Plan instead of switching tabs.
  useEffect(() => {
    if (!active) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      close();
      return true;
    });
    return () => subscription.remove();
  });

  useEffect(() => () => replyTimers.current.forEach(clearTimeout), []);

  return (
    <NewPlanContext.Provider
      value={{ active, messages, draft, setDraft, start, send, close, inputRef }}>
      {children}
    </NewPlanContext.Provider>
  );
}

export function useNewPlan() {
  const value = useContext(NewPlanContext);
  if (!value) throw new Error('useNewPlan must be used inside NewPlanProvider');
  return value;
}
