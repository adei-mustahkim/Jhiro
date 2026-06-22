"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { MessageSquare, X, ArrowLeft, Send, Check, CheckCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatRelativeTime } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ProjectItem {
  id: string;
  name: string;
  createdAt: string;
  client: {
    companyName: string;
  };
  chatThread?: {
    recipientUnreadSince?: string | null;
    messages?: Array<{
      id: string;
      message: string;
      createdAt: string;
      sender: {
        id: string;
        name: string;
      };
    }>;
  } | null;
}

interface ChatMessage {
  id: string;
  message: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    role: string;
  };
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  link: string | null;
  createdAt: string;
}

export function FloatingChat() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [recipientUnreadSince, setRecipientUnreadSince] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const activeUser = session?.user;

  // Fetch all accessible projects (reduced from 100 to 20)
  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch("/api/v1/projects?pageSize=20");
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
        
        // Auto-select if there is exactly 1 project (typical for clients)
        if (data.projects && data.projects.length === 1) {
          setSelectedProject(data.projects[0]);
        }
      }
    } catch (error) {
      console.warn("Failed to load projects for chat widget:", error instanceof Error ? error.message : error);
    }
  }, []);

  // Fetch unread notifications (reduced from 100 to 20)
  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch("/api/v1/notifications?limit=20");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.warn("Failed to fetch notifications for chat widget:", error instanceof Error ? error.message : error);
    }
  }, []);

  // Fetch messages for a specific project
  const fetchMessages = useCallback(async (projectId: string, silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const response = await fetch(`/api/v1/projects/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        const msgList = data.chatThread?.messages || [];
        setMessages(msgList);
        setRecipientUnreadSince(data.chatThread?.recipientUnreadSince || null);
      }
    } catch (error) {
      console.warn("Failed to fetch chat messages:", error instanceof Error ? error.message : error);
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, []);

  // Scroll chat messages to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Trigger project and notification loading ONLY when chat panel opens
  useEffect(() => {
    if (isOpen && activeUser) {
      fetchProjects();
      fetchNotifications();
    }
  }, [isOpen, activeUser, fetchProjects, fetchNotifications]);

  // Handle message and notification polling when chat panel is open
  useEffect(() => {
    if (!isOpen) return;
    
    // Poll notifications too
    fetchNotifications();

    if (selectedProject) {
      fetchMessages(selectedProject.id, true);
    }

    // Poll every 12 seconds
    const interval = setInterval(() => {
      fetchNotifications();
      if (selectedProject) {
        fetchMessages(selectedProject.id, true);
      }
    }, 12000);

    return () => clearInterval(interval);
  }, [isOpen, selectedProject, fetchMessages, fetchNotifications]);

  // Mark project notifications as read when selectedProject or notifications update
  useEffect(() => {
    if (selectedProject && notifications.length > 0) {
      const projectUnreadNotifications = notifications.filter(
        (n) => !n.isRead && n.link && n.link.includes(`/projects/${selectedProject.id}`)
      );

      if (projectUnreadNotifications.length > 0) {
        // Optimistic local update
        setNotifications((prev) =>
          prev.map((n) =>
            n.link && n.link.includes(`/projects/${selectedProject.id}`) ? { ...n, isRead: true } : n
          )
        );

        // Update database in background
        projectUnreadNotifications.forEach(async (n) => {
          try {
            await fetch("/api/v1/notifications", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: n.id }),
            });
          } catch (err) {
            console.error("Failed to mark notification read in background:", err);
          }
        });
      }
    }
  }, [selectedProject, notifications]);

  // Scroll to bottom whenever messages load/change
  useEffect(() => {
    if (isOpen && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Calculate project IDs that have unread messages
  const unreadProjectIds = notifications
    .filter((n) => !n.isRead && n.link)
    .map((n) => {
      const match = n.link!.match(/\/projects\/([a-f0-9-]+)/i);
      return match ? match[1] : null;
    })
    .filter(Boolean) as string[];

  // Send message
  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProject || !newMessage.trim()) return;

    const content = newMessage.trim();
    setIsSending(true);
    try {
      const response = await fetch(`/api/v1/projects/${selectedProject.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });
      
      if (response.ok) {
        const payload = await response.json();
        setMessages((prev) => [...prev, payload]);
        setNewMessage("");
        setRecipientUnreadSince((prev) => prev || payload.createdAt);
      } else {
        throw new Error("Gagal mengirim pesan");
      }
    } catch (error) {
      toast({
        title: "Pesan gagal dikirim",
        description: "Pastikan koneksi internet stabil dan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  }

  // Load chat for a specific project clicked in list
  function handleSelectProject(project: ProjectItem) {
    setSelectedProject(project);
    fetchMessages(project.id);
  }

  // Go back to project list view (only if user has multiple projects, else do nothing)
  function handleBackToList() {
    if (projects.length > 1) {
      setSelectedProject(null);
      setMessages([]);
      fetchNotifications(); // Refresh list indicators
    }
  }

  if (!activeUser) return null;

  // Sort projects: newest message first, fallback to project creation date if no message
  const sortedProjects = [...projects].sort((a, b) => {
    const aMsg = a.chatThread?.messages?.[0];
    const bMsg = b.chatThread?.messages?.[0];
    
    const aTime = aMsg ? new Date(aMsg.createdAt).getTime() : new Date(a.createdAt).getTime();
    const bTime = bMsg ? new Date(bMsg.createdAt).getTime() : new Date(b.createdAt).getTime();
    
    return bTime - aTime;
  });

  const totalUnreadChatMessages = unreadProjectIds.length;

  return (
    <>
      {/* Floating Chat Bubble Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-950 text-white shadow-xl cursor-pointer hover:bg-emerald-900 transition-all duration-300 hover:scale-105 active:scale-95 print:hidden"
        title="Buka Diskusi Chat"
        aria-label="Obrolan CS"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <MessageSquare className="h-6 w-6" />
            {totalUnreadChatMessages > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
                {totalUnreadChatMessages}
              </span>
            )}
          </>
        )}
      </button>

      {/* Floating Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-[360px] h-[480px] sm:h-[500px] bg-white rounded-2xl shadow-2xl border border-emerald-950/10 z-50 flex flex-col overflow-hidden animate-slide-up print:hidden">
          
          {/* Header */}
          <div className="flex h-14 items-center justify-between bg-emerald-950 px-4 text-white">
            <div className="flex items-center gap-2">
              {selectedProject && projects.length > 1 && (
                <button
                  onClick={handleBackToList}
                  className="rounded p-1 hover:bg-white/10 transition-colors"
                  title="Kembali"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              )}
              <div className="leading-tight">
                <span className="block text-xs font-semibold uppercase tracking-wider text-emerald-300">Obrolan Project</span>
                {selectedProject ? (
                  <Link
                    href={session?.user?.role === "CLIENT" ? `/portal/projects/${selectedProject.id}` : `/projects/${selectedProject.id}`}
                    className="block text-sm font-bold truncate max-w-[180px] sm:max-w-[220px] hover:underline hover:text-emerald-200"
                    title="Buka Detail Project"
                  >
                    {selectedProject.name}
                  </Link>
                ) : (
                  <span className="block text-sm font-bold truncate max-w-[180px] sm:max-w-[220px]">
                    Pilih Diskusi Project
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-green-400">Online</span>
            </div>
          </div>

          {/* Body Container */}
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
            
            {/* View 1: Project List Selection (if not selected) */}
            {!selectedProject ? (
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 py-1">Daftar Proyek Aktif</p>
                {sortedProjects.length === 0 ? (
                  <div className="py-20 text-center text-xs text-muted-foreground font-medium">
                    Belum ada proyek terhubung
                  </div>
                ) : (
                  sortedProjects.map((project) => {
                    const hasUnread = unreadProjectIds.includes(project.id);
                    const lastMsg = project.chatThread?.messages?.[0];
                    const detailUrl = session?.user?.role === "CLIENT" ? `/portal/projects/${project.id}` : `/projects/${project.id}`;
                    
                    // Determine if the last message is read or unread
                    let isLastMsgMe = false;
                    let isLastMsgRead = false;
                    if (lastMsg && activeUser) {
                      isLastMsgMe = lastMsg.sender.id === activeUser.id;
                      if (isLastMsgMe) {
                        const recipientUnreadSince = project.chatThread?.recipientUnreadSince;
                        if (!recipientUnreadSince) {
                          isLastMsgRead = true;
                        } else {
                          isLastMsgRead = new Date(lastMsg.createdAt).getTime() < new Date(recipientUnreadSince).getTime();
                        }
                      }
                    }

                    return (
                      <div
                        key={project.id}
                        className={`group w-full p-3.5 bg-white border rounded-xl hover:border-emerald-500/20 shadow-[0_2px_8px_rgb(0,0,0,0.01)] transition-all duration-200 ${
                          hasUnread ? "border-emerald-500/20 bg-emerald-50/5" : "border-slate-100"
                        }`}
                      >
                        {/* Upper row: Clickable chat selector */}
                        <div
                          onClick={() => handleSelectProject(project)}
                          className="cursor-pointer"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <h4 className={`text-xs truncate flex-1 ${hasUnread ? "font-bold text-emerald-950" : "font-medium text-slate-800"}`}>
                              {project.name}
                            </h4>
                            {hasUnread && (
                              <span className="flex h-2 w-2 shrink-0 rounded-full bg-red-500 animate-pulse mt-1" />
                            )}
                          </div>
                          
                          {/* Last message preview if any */}
                          {lastMsg && (
                            <div className="flex items-center gap-1 mt-1 text-[11px]">
                              {isLastMsgMe && (
                                <span className="shrink-0">
                                  {isLastMsgRead ? (
                                    <CheckCheck className="h-3.5 w-3.5 text-sky-500" />
                                  ) : (
                                    <Check className="h-3.5 w-3.5 text-slate-400" />
                                  )}
                                </span>
                              )}
                              <p className={`truncate flex-1 ${hasUnread ? "font-semibold text-slate-900" : "text-slate-500"}`}>
                                {isLastMsgMe ? "Anda: " : `${lastMsg.sender.name}: `}
                                {lastMsg.message}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Lower row: Client Name link (Go to project detail) */}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/50">
                          <Link
                            href={detailUrl}
                            className="text-[10px] font-bold text-emerald-800 hover:text-emerald-950 hover:underline"
                            title="Buka Detail Project"
                          >
                            {project.client.companyName}
                          </Link>
                          {lastMsg && (
                            <span className="text-[9px] text-slate-400">
                              {formatRelativeTime(lastMsg.createdAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              
              /* View 2: Active Chat Messages */
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {isLoading ? (
                    <div className="flex h-full items-center justify-center">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-950 border-t-transparent" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="grid h-full place-items-center text-center">
                      <div className="p-4">
                        <MessageSquare className="h-8 w-8 mx-auto text-emerald-950/20 mb-2" />
                        <p className="text-xs font-semibold text-slate-700">Belum ada obrolan</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Kirim pesan di bawah untuk memulai.</p>
                      </div>
                    </div>
                  ) : (
                    messages.map((item) => {
                      const isMe = item.sender.id === activeUser.id;
                      
                      let isRead = false;
                      if (isMe) {
                        if (!recipientUnreadSince) {
                          isRead = true;
                        } else {
                          isRead = new Date(item.createdAt).getTime() < new Date(recipientUnreadSince).getTime();
                        }
                      }

                      return (
                        <div
                          key={item.id}
                          className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-[0_2px_8px_rgb(0,0,0,0.01)] text-xs ${
                              isMe
                                ? "bg-emerald-950 text-white rounded-br-none"
                                : "bg-white text-slate-800 border border-slate-100 rounded-bl-none"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-4 text-[10px]">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold">{item.sender.name}</span>
                                <span className={isMe ? "text-emerald-300" : "text-slate-400"}>
                                  {formatRelativeTime(item.createdAt)}
                                </span>
                              </div>
                              {isMe && (
                                <span className="shrink-0 mt-0.5" title={isRead ? "Dibaca" : "Terkirim"}>
                                  {isRead ? (
                                    <CheckCheck className="h-3.5 w-3.5 text-sky-400" />
                                  ) : (
                                    <Check className="h-3.5 w-3.5 text-emerald-300" />
                                  )}
                                </span>
                              )}
                            </div>
                            <p className="mt-1 whitespace-pre-wrap break-words leading-relaxed">
                              {item.message}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input Box */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 border-t border-slate-100 bg-white flex items-end gap-2"
                >
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    maxLength={2000}
                    rows={1}
                    placeholder="Tulis pesan..."
                    className="resize-none py-2 px-3 text-xs bg-slate-50 min-h-9 max-h-16 border-none focus-visible:ring-emerald-700 rounded-xl"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        e.currentTarget.form?.requestSubmit();
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    loading={isSending}
                    disabled={!newMessage.trim()}
                    size="icon"
                    className="h-9 w-9 shrink-0 rounded-xl bg-emerald-950 text-white hover:bg-emerald-900 transition-colors shadow-md"
                    title="Kirim Pesan"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

