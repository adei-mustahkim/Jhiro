"use client";

import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ChatMessageItem {
  id: string;
  message: string;
  createdAt: string;
  sender: { id: string; name: string; role: string };
}

export function ProjectChat({ projectId, currentUserId, initialMessages }: { projectId: string; currentUserId: string; initialMessages: ChatMessageItem[] }) {
  const { toast } = useToast();
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageIdRef = useRef<string>(initialMessages[initialMessages.length - 1]?.id ?? "");

  // Poll for new messages every 5 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/v1/projects/${projectId}/messages`);
        if (!response.ok) return;
        const data = await response.json();
        if (Array.isArray(data.messages)) {
          const newMessages = data.messages.filter(
            (msg: ChatMessageItem) => !messages.find((m) => m.id === msg.id)
          );
          if (newMessages.length > 0) {
            setMessages((current) => [...current, ...newMessages]);
          }
        }
      } catch {
        // Silently fail polling
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [projectId, messages]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].id !== lastMessageIdRef.current) {
      lastMessageIdRef.current = messages[messages.length - 1].id;
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  async function sendMessage(event: React.FormEvent) {
    event.preventDefault();
    const content = message.trim();
    if (!content) return;
    setIsSending(true);
    try {
      const response = await fetch(`/api/v1/projects/${projectId}/messages`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: content }) });
      const payload: unknown = await response.json();
      if (!response.ok) throw new Error(readError(payload, "Pesan gagal dikirim"));
      if (!isMessage(payload)) throw new Error("Respons pesan tidak valid");
      setMessages((current) => [...current, { ...payload, createdAt: String(payload.createdAt) }]);
      setMessage("");
    } catch (error) {
      toast({ title: "Pesan belum terkirim", description: error instanceof Error ? error.message : "Silakan coba kembali.", variant: "destructive" });
    } finally {
      setIsSending(false);
    }
  }

  return <div className="space-y-4"><div className="max-h-[420px] min-h-52 space-y-3 overflow-y-auto rounded-xl bg-emerald-950/[0.025] p-4" aria-live="polite">{messages.length===0?<div className="grid min-h-44 place-items-center text-center"><div><p className="text-sm font-medium text-emerald-950">Belum ada percakapan</p><p className="mt-1 text-sm text-slate-600">Kirim pesan pertama untuk memulai diskusi project.</p></div></div>:messages.map((item)=><div key={item.id} className={`flex ${item.sender.id===currentUserId?"justify-end":"justify-start"}`}><div className={`max-w-[85%] rounded-xl px-4 py-3 ${item.sender.id===currentUserId?"bg-emerald-700 text-white":"border border-emerald-950/10 bg-white text-emerald-950"}`}><div className="flex items-center gap-2 text-xs"><span className="font-semibold">{item.sender.name}</span><span className={item.sender.id===currentUserId?"text-emerald-100":"text-slate-500"}>{formatTime(item.createdAt)}</span></div><p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6">{item.message}</p></div></div>)}<div ref={messagesEndRef} /></div><form onSubmit={sendMessage} className="flex items-end gap-3"><Textarea value={message} onChange={(event)=>setMessage(event.target.value)} maxLength={5000} rows={2} placeholder="Tulis pesan tentang project..." aria-label="Pesan project" onKeyDown={(event)=>{if(event.key==="Enter"&&!event.shiftKey){event.preventDefault();event.currentTarget.form?.requestSubmit()}}}/><Button type="submit" loading={isSending} disabled={!message.trim()}><Send className="mr-2 h-4 w-4"/>Kirim</Button></form></div>;
}

function formatTime(value:string){return new Intl.DateTimeFormat("id-ID",{dateStyle:"medium",timeStyle:"short"}).format(new Date(value))}
function readError(payload:unknown,fallback:string){return typeof payload==="object"&&payload!==null&&"error" in payload&&typeof payload.error==="string"?payload.error:fallback}
function isMessage(payload:unknown):payload is ChatMessageItem{return typeof payload==="object"&&payload!==null&&"id" in payload&&typeof payload.id==="string"&&"message" in payload&&typeof payload.message==="string"&&"createdAt" in payload&&"sender" in payload&&typeof payload.sender==="object"&&payload.sender!==null&&"id" in payload.sender&&typeof payload.sender.id==="string"&&"name" in payload.sender&&typeof payload.sender.name==="string"&&"role" in payload.sender&&typeof payload.sender.role==="string"}
