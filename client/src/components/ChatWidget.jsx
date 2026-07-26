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
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/chat/stream`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: newMessages }),
          signal: controller.signal,
        },
      );

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split("\n");

        for (const line of lines) {
          const trimmed = line.trim();
          if (
            !trimmed ||
            trimmed === "data:[DONE]" ||
            trimmed === "data: [DONE]"
          )
            continue;

          const jsonStr = trimmed.startsWith("data:")
            ? trimmed.slice(5)
            : trimmed;

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
    <div className="fixed bottom-5 right-5 z-[9999] flex max-h-[500px] w-[350px] flex-col rounded-xl border border-gray-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
      {/* Header */}
      <div
        className="rounded-t-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white"
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
      <div className="flex min-h-[300px] flex-1 flex-col gap-2.5 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p style={{ color: "#9ca3af", fontSize: 13, textAlign: "center" }}>
            Ask me anything about our products
          </p>
        )}

        {messages.map((msg, i) => (
          <div
            className={`max-w-[85%] rounded-[10px] px-3 py-2 text-[13px] leading-[1.5] ${
              msg.role === "user"
                ? "self-end bg-indigo-600 text-white"
                : "self-start bg-gray-100 text-gray-900"
            }`}
            key={i}
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
      <div className="flex gap-2 border-t border-gray-200 p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about products..."
          disabled={streaming}
          className={`flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 ${
            streaming ? "opacity-60" : "opacity-100"
          }`}
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
            className="cursor-pointer rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white transition hover:bg-indigo-700"
          >
            Send
          </button>
        )}
      </div>
    </div>
  );
}
