import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, Progress } from '../ui';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface DonationModeProps {
  onComplete: () => void;
}

const facts = [
  "O- is the universal donor type that anyone can receive!",
  "Your donation can save up to 3 lives.",
  "Blood platelets only last 5 days - your donation is urgent!",
  "The average adult has 5 liters of blood.",
  "You replacing the donated blood within 24 hours!",
];

const trivia = [
  { q: "What is the rarest blood type?", a: "AB- (less than 1% of people)" },
  { q: "How long does donation take?", a: "About 8-10 minutes for blood, longer for platelets" },
  { q: "Who can receive O- blood?", a: "Anyone! O- is the universal donor" },
];

export function DonationMode({ onComplete }: DonationModeProps) {
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'chat' | 'music' | 'trivia' | 'impact'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: "You're doing amazing! Did you know O- blood can save newborns in emergencies? 🩸" },
  ]);
  const [input, setInput] = useState('');
  const [triviaIndex, setTriviaIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simulate donation progress
  useEffect(() => {
    if (progress >= 100) return;
    const interval = setInterval(() => {
      setProgress(p => Math.min(p + 1, 100));
    }, 800);
    return () => clearInterval(interval);
  }, [progress]);

  // Auto messages
  useEffect(() => {
    if (progress === 25) {
      setMessages(m => [...m, { id: Date.now().toString(), role: 'assistant', content: "Great progress! You're halfway there. Keep breathing steadily." }]);
    }
    if (progress === 50) {
      setMessages(m => [...m, { id: Date.now().toString(), role: 'assistant', content: "Most donors feel great knowing they're saving lives. You're amazing! 💪" }]);
    }
    if (progress === 75) {
      setMessages(m => [...m, { id: Date.now().toString(), role: 'assistant', content: "Almost done! Just a few more minutes." }]);
    }
  }, [progress]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(m => [...m, { id: Date.now().toString(), role: 'user', content: input }]);
    
    // Simulated AI response
    setTimeout(() => {
      const response = facts[Math.floor(Math.random() * facts.length)];
      setMessages(m => [...m, { id: Date.now().toString(), role: 'assistant', content: response }]);
    }, 500);
    
    setInput('');
  };

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-text-primary">DONATION IN PROGRESS</h2>
          <span className="text-sm text-success">{progress}%</span>
        </div>
        <Progress value={progress} variant={progress < 50 ? 'warning' : 'success'} className="mt-2" />
      </div>

      {/* Content based on tab */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'chat' && (
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                      msg.role === 'user' 
                        ? 'bg-blood text-white' 
                        : 'bg-white/10 text-text-primary'
                    }`}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Chat with AI companion..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blood"
                />
                <Button variant="primary" onClick={sendMessage}>Send</Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'music' && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-blood/10 flex items-center justify-center">
                <span className="text-4xl">🎵</span>
              </div>
              <p className="text-text-muted">Relaxation playlist</p>
              <p className="text-xs text-text-muted mt-2">(Spotify integration)</p>
            </div>
          </div>
        )}

        {activeTab === 'trivia' && (
          <div className="h-full p-4">
            <Card>
              <h3 className="font-display font-bold text-text-primary mb-4">Blood Donation Trivia</h3>
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-white/5">
                  <p className="text-sm text-text-muted">Q: {trivia[triviaIndex].q}</p>
                  <p className="text-sm text-success mt-2">A: {trivia[triviaIndex].a}</p>
                </div>
                <Button variant="secondary" className="w-full" onClick={() => setTriviaIndex(i => (i + 1) % trivia.length)}>
                  Next Question
                </Button>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'impact' && (
          <div className="h-full p-4">
            <Card>
              <h3 className="font-display font-bold text-text-primary mb-4">Your Impact</h3>
              <div className="space-y-4">
                <div className="text-center p-4 rounded-lg bg-success/10">
                  <p className="text-3xl font-display font-black text-success">23</p>
                  <p className="text-xs text-text-muted uppercase">Lives Saved</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-blood/10">
                  <p className="text-3xl font-display font-black text-blood">12</p>
                  <p className="text-xs text-text-muted uppercase">Donation Streak</p>
                </div>
                <p className="text-sm text-text-muted text-center">
                  This blood may help a premature baby in the NICU.
                </p>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-t border-white/5">
        {(['chat', 'music', 'trivia', 'impact'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${
              activeTab === tab 
                ? 'text-blood border-t-2 border-blood' 
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            {tab === 'chat' ? '💬 Chat' : tab === 'music' ? '🎵 Music' : tab === 'trivia' ? '🧠 Trivia' : '❤️ Impact'}
          </button>
        ))}
      </div>

      {/* Complete overlay */}
      <AnimatePresence>
        {progress >= 100 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-bg-primary/95 flex items-center justify-center"
          >
            <Card className="text-center max-w-md mx-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-24 h-24 mx-auto mb-4 rounded-full bg-success/20 flex items-center justify-center"
              >
                <span className="text-5xl">🏆</span>
              </motion.div>
              <h2 className="text-2xl font-display font-black text-success mb-2">
                Donation Complete!
              </h2>
              <p className="text-text-muted mb-6">
                Thank you for saving a life! You've earned the "Life Saver" badge.
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="primary" onClick={onComplete}>
                  View Impact Card
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}