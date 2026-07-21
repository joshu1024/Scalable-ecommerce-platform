import { useState, useRef } from "react";

export default function ChatWidget() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim() || streaming) return;

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages([...newMessages, { role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("http://localhost:4000/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
        signal: controller.signal,
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // accumulate chunks in buffer
        buffer += decoder.decode(value, { stream: true });

        // split on double newlines — each SSE event ends with \n\n
        const parts = buffer.split("\n\n");

        // last part may be incomplete — keep it in the buffer
        buffer = parts.pop();

        for (const part of parts) {
          const line = part.trim();

          if (!line || line === "data:[DONE]") continue;

          // handle both "data: {...}" and "{...}" formats
          const jsonStr = line.startsWith("data:") ? line.slice(5) : line;

          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed.token) {
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: updated[updated.length - 1].content + parsed.token,
                };
                return updated;
              });
            }
          } catch (e) {
            console.log("parse error:", e.message, "on:", jsonStr);
          }
        }
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Stream error:", error);
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const stopStream = () => {
    if (abortRef.current) abortRef.current.abort();
    setStreaming(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: 350,
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        background: "#fff",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        maxHeight: 500,
        zIndex: 9999,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #e5e7eb",
          fontWeight: 500,
          fontSize: 14,
          background: "#4f46e5",
          color: "#fff",
          borderRadius: "12px 12px 0 0",
        }}
      >
        🛍️ Shopping Assistant
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          minHeight: 300,
        }}
      >
        {messages.length === 0 && (
          <p style={{ color: "#9ca3af", fontSize: 13, textAlign: "center" }}>
            Ask me anything about our products
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              background: msg.role === "user" ? "#4f46e5" : "#f3f4f6",
              color: msg.role === "user" ? "#fff" : "#111",
              padding: "8px 12px",
              borderRadius: 10,
              fontSize: 13,
              maxWidth: "85%",
              lineHeight: 1.5,
            }}
          >
            {msg.content}
            {msg.role === "assistant" &&
              streaming &&
              i === messages.length - 1 && (
                <span style={{ opacity: 0.5 }}>▋</span>
              )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div
        style={{
          padding: "10px 12px",
          borderTop: "1px solid #e5e7eb",
          display: "flex",
          gap: 8,
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about products..."
          disabled={streaming}
          style={{
            flex: 1,
            padding: "8px 12px",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            fontSize: 13,
            outline: "none",
            opacity: streaming ? 0.6 : 1,
          }}
        />
        {streaming ? (
          <button
            onClick={stopStream}
            style={{
              padding: "8px 12px",
              background: "#ef4444",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            Stop
          </button>
        ) : (
          <button
            onClick={sendMessage}
            style={{
              padding: "8px 12px",
              background: "#4f46e5",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            Send
          </button>
        )}
      </div>
    </div>
  );
}
