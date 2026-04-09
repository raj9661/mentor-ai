"use client";

import { useEffect, useState, useRef } from "react";
import { chatApi, ConversationItem, Message } from "@/lib/api";
import ReactMarkdown from "react-markdown";

export default function ChatPage() {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (activeConvId) {
      loadHistory(activeConvId);
    }
  }, [activeConvId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  async function loadConversations() {
    try {
      const convs = await chatApi.conversations();
      setConversations(convs);
      if (convs.length > 0 && !activeConvId) {
        setActiveConvId(convs[0].id);
      } else if (convs.length === 0) {
        startNewChat();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setInitLoading(false);
    }
  }

  async function loadHistory(convId: string) {
    try {
      setInitLoading(true);
      const data = await chatApi.history(convId);
      setMessages(data.messages);
    } catch (err) {
      console.error(err);
    } finally {
      setInitLoading(false);
    }
  }

  async function startNewChat() {
    try {
      const data = await chatApi.start(language);
      setActiveConvId(null);
      setMessages([{
        id: "temp-greeting",
        conversation_id: "",
        sender: "ai",
        message: data.greeting,
        created_at: new Date().toISOString()
      }]);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    
    // Add temp user message
    const tempId = Date.now().toString();
    setMessages(prev => [...prev, {
      id: tempId,
      conversation_id: activeConvId || "",
      sender: "user",
      message: userMsg,
      created_at: new Date().toISOString()
    }]);
    
    setLoading(true);

    try {
      const data = await chatApi.send({
        message: userMsg,
        conversation_id: activeConvId || undefined,
        language
      });
      
      if (!activeConvId) {
        setActiveConvId(data.conversation_id);
        loadConversations(); // refresh sidebar list
      }
      
      setMessages(prev => prev.filter(m => m.id !== tempId).concat([data.user_message, data.ai_message]));
    } catch (err) {
      console.error(err);
      // Remove temp message on error
      setMessages(prev => prev.filter(m => m.id !== tempId));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "calc(100vh - 120px)", display: "flex", flexDirection: "row", gap: "24px", flexWrap: "wrap" }}>
      {/* Sidebar List */}
      <div className="card" style={{ width: "100%", maxWidth: "260px", display: "flex", flexDirection: "column", overflow: "hidden", height: "fit-content", flexBasis: "260px", flexGrow: 1 }}>
        <div style={{ padding: "16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 600 }}>Conversations</h2>
          <button onClick={startNewChat} className="btn btn-ghost" style={{ padding: "4px 8px" }}>➕</button>
        </div>
        <div style={{ flex: 1, maxHeight: "300px", overflowY: "auto", padding: "12px" }}>
          {conversations.map(c => (
            <div
              key={c.id}
              onClick={() => setActiveConvId(c.id)}
              style={{
                padding: "12px",
                borderRadius: "8px",
                cursor: "pointer",
                background: activeConvId === c.id ? "rgba(108,99,255,0.15)" : "transparent",
                border: activeConvId === c.id ? "1px solid rgba(108,99,255,0.3)" : "1px solid transparent",
                marginBottom: "8px",
                fontSize: "14px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
            >
              {c.title || "New Conversation"}
            </div>
          ))}
        </div>
      </div>
 
      {/* Chat Area */}
      <div className="card" style={{ flex: "1 1 400px", minWidth: 0, display: "flex", flexDirection: "column", overflow: "hidden", height: "600px" }}>
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--gradient-brand)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>🎓</div>
            <h2 style={{ fontSize: "16px", fontWeight: 600 }}>MentorAI</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Language:</span>
            <select
              className="input"
              style={{ padding: "6px 12px", width: "auto", height: "auto" }}
              value={language}
              onChange={(e) => setLanguage(e.target.value as "en" | "hi")}
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
            </select>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          {initLoading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
               <div className="spinner" style={{ borderColor: "rgba(108,99,255,0.2)", borderTopColor: "var(--accent-primary)" }} />
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {messages.map((msg) => (
                <div key={msg.id} style={{ display: "flex", justifyContent: msg.sender === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{
                    maxWidth: "80%",
                    padding: "14px 18px",
                    borderRadius: msg.sender === "user" ? "16px 16px 0 16px" : "16px 16px 16px 0",
                    background: msg.sender === "user" ? "var(--gradient-brand)" : "var(--bg-secondary)",
                    color: msg.sender === "user" ? "white" : "var(--text-primary)",
                    border: msg.sender === "ai" ? "1px solid var(--border)" : "none",
                    boxShadow: msg.sender === "user" ? "0 4px 12px rgba(108,99,255,0.2)" : "none"
                  }}>
                    {msg.sender === "ai" && <div style={{ fontSize: "10px", fontWeight: 700, marginBottom: "6px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>MENTORAI</div>}
                    <div className="prose-chat" style={{ fontSize: "14px", lineHeight: 1.6 }}>
                      <ReactMarkdown>{msg.message}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div style={{ padding: "14px 18px", borderRadius: "16px 16px 16px 0", background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
                    <div className="typing-dot" />
                    <div className="typing-dot" style={{ margin: "0 4px" }} />
                    <div className="typing-dot" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{ padding: "16px", borderTop: "1px solid var(--border)", background: "var(--bg-secondary)" }}>
          <form onSubmit={handleSend} style={{ display: "flex", gap: "12px" }}>
            <input
              type="text"
              className="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              disabled={loading}
              style={{ flex: 1, padding: "14px 16px", borderRadius: "100px" }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!input.trim() || loading}
              style={{ borderRadius: "100px", padding: "0 24px", height: "48px" }}
            >
              Send 🚀
            </button>
          </form>
          <div style={{ textAlign: "center", marginTop: "8px", fontSize: "11px", color: "var(--text-muted)" }}>
            MentorAI can make mistakes. Consider double checking important information.
          </div>
        </div>
      </div>
    </div>
  );
}
