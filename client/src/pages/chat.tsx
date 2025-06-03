import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatMessage {
  id: number;
  userId: string;
  message: string;
  timestamp: string;
  role: string;
}

export default function Chat() {
  const userId = "demo";
  const [text, setText] = useState("");
  const queryClient = useQueryClient();
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: messages = [] } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat", { userId }],
    queryFn: async () => {
      const res = await fetch(`/api/chat/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch messages");
      return res.json();
    },
  });

  const sendMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, message: text }),
      });
      if (!res.ok) throw new Error("Failed to send message");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat", { userId }] });
      setText("");
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMutation.mutate();
  };

  return (
    <div className="min-h-screen flex flex-col pb-24 bg-white">
      <Header onOpenParentalDashboard={() => {}} />
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-3 rounded-xl max-w-md ${m.role === "user" ? "bg-coral text-white self-end ml-auto" : "bg-gray-100"}`}
          >
            {m.message}
          </div>
        ))}
        {sendMutation.isLoading && (
          <div className="p-3 rounded-xl bg-gray-100 max-w-md">
            <i className="fas fa-spinner fa-spin"></i>
          </div>
        )}
        <div ref={bottomRef}></div>
      </main>
      <form onSubmit={handleSubmit} className="p-4 flex space-x-2 fixed bottom-0 left-0 right-0 bg-white border-t">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Nachricht senden..."
          className="flex-1"
        />
        <Button type="submit" disabled={sendMutation.isLoading || !text.trim()}>Senden</Button>
      </form>
      <BottomNavigation />
    </div>
  );
}
