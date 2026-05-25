// Assistant drawer: keeps the Gemini chat and task commands in one place.
// It stores the current session chat history while the user is logged in.
// Use this file to understand the floating assistant behavior.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, Send, X } from 'lucide-react';
import { Button } from './core';
import { cn } from '../shared/cn';
import { sendChatMessage } from '../api/chatService';
import { useData } from '../state/DataContext';
import { useAuth } from '../hooks/useAuth';

const parseCommand = (message) => {
  const text = message.trim();
  const lower = text.toLowerCase();

  const taskPrefixes = ['create task:', 'add task:', 'new task:', 'create a task called', 'make a task called'];
  const matchedPrefix = taskPrefixes.find((prefix) => lower.startsWith(prefix));
  if (matchedPrefix) {
    return {
      action: 'create-task',
      title: text.slice(matchedPrefix.length).trim()
    };
  }

  if (lower.startsWith('delete task:')) {
    return { action: 'delete-task', id: text.slice(12).trim() };
  }

  if (lower.startsWith('undo task:')) {
    return { action: 'undo-task', id: text.slice(10).trim() };
  }

  const roleMatch = text.match(/^(?:change|update|assign)\s+role\s+(?:of\s+)?(.+?)\s+to\s+(.+?)(?:\s+in\s+(.+))?$/i);
  if (roleMatch) {
    return {
      action: 'change-role',
      userQuery: roleMatch[1].trim(),
      roleQuery: roleMatch[2].trim(),
      teamQuery: roleMatch[3]?.trim() || ''
    };
  }

  return null;
};

export const FloatingAssistant = () => {
  const { users, teams, roles, createTask, deleteTask, undoTask, assignRole } = useData();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'How can I help?' }]);
  const [input, setInput] = useState('');
  const drawerRef = useRef(null);
  const storageKey = 'rbac_assistant_messages';
  const quickActions = [
    { label: 'Create task', value: 'create task: Prepare report' },
    { label: 'Change role', value: 'change role of Alice Employee to Manager in Sales' }
  ];

  useEffect(() => {
    if (!user) {
      sessionStorage.removeItem(storageKey);
      setMessages([{ role: 'assistant', content: 'How can I help?' }]);
      setOpen(false);
      setInput('');
      return;
    }

    const storedMessages = sessionStorage.getItem(storageKey);
    if (storedMessages) {
      try {
        const parsedMessages = JSON.parse(storedMessages);
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          setMessages(parsedMessages);
        }
      } catch {
        sessionStorage.removeItem(storageKey);
      }
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    sessionStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, user]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [open]);

  const findMatch = (collection, query) => {
    const search = query.trim().toLowerCase();
    if (!search) return null;

    return collection.find((item) => {
      const label = `${item.name || ''} ${item.email || ''}`.trim().toLowerCase();
      return label.includes(search) || search.includes(label);
    }) || null;
  };


  const submit = async () => {
    if (!input.trim()) return;

    const command = parseCommand(input);
    setMessages((current) => [...current, { role: 'user', content: input }]);

    try {
      if (command?.action === 'create-task') {
        if (!command.title) {
          throw new Error('Please include a task title.');
        }
        const created = await createTask({ title: command.title });
        setMessages((current) => [...current, { role: 'assistant', content: `Task created: ${created.title}` }]);
      } else if (command?.action === 'delete-task') {
        await deleteTask(command.id);
        setMessages((current) => [...current, { role: 'assistant', content: `Task deleted: ${command.id}` }]);
      } else if (command?.action === 'undo-task') {
        await undoTask(command.id);
        setMessages((current) => [...current, { role: 'assistant', content: `Task reopened: ${command.id}` }]);
      } else if (command?.action === 'change-role') {
        if (!user?.isAdmin && !user?.isManager) {
          setMessages((current) => [...current, { role: 'assistant', content: 'Only admins and managers can change an employee role.' }]);
          setInput('');
          return;
        }

        const targetUser = findMatch(users, command.userQuery);
        const targetRole = findMatch(roles, command.roleQuery);
        const targetTeam = command.teamQuery ? findMatch(teams, command.teamQuery) : teams.length === 1 ? teams[0] : null;

        if (!targetUser) {
          throw new Error(`I could not find the employee: ${command.userQuery}`);
        }

        if (!targetRole) {
          throw new Error(`I could not find the role: ${command.roleQuery}`);
        }

        if (!targetTeam) {
          throw new Error('Please mention the team name for the role change.');
        }

        await assignRole({ userId: targetUser._id, teamId: targetTeam._id, roleId: targetRole._id });
        setMessages((current) => [...current, { role: 'assistant', content: `Role changed: ${targetUser.name} is now ${targetRole.name} in ${targetTeam.name}` }]);
      } else {
        const response = await sendChatMessage({ message: input, context: 'You are a professional operations assistant. Reply briefly, clearly, and without filler.' });
        setMessages((current) => [...current, { role: 'assistant', content: response.data.reply }]);
      }
      setInput('');
    } catch (error) {
      setMessages((current) => [...current, { role: 'assistant', content: error?.response?.data?.message || 'Unable to complete that action right now.' }]);
    }
  };

  const chatLabel = useMemo(() => (open ? 'Close assistant' : 'Assistant'), [open]);

  return (
    <>
      {open ? (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-slate-950/20" aria-hidden="true" />
          <div
            ref={drawerRef}
            className="absolute inset-y-0 right-0 flex h-screen w-[420px] max-w-[90vw] flex-col border-l border-border bg-surface shadow-soft"
          >
            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-4">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-primary" />
                <div>
                  <div className="text-sm font-semibold text-text-primary">Workspace Assistant</div>
                  <div className="text-xs text-text-muted">Ask a question or use a command</div>
                  <div className="mt-1 text-[11px] leading-5 text-text-muted">
                    Examples: <span className="font-medium text-text-primary">create task: Prepare report</span> ·{' '}
                    <span className="font-medium text-text-primary">change role of Alice to Manager in Sales</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)} aria-label="Close assistant">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 space-y-3 overflow-auto px-4 py-3 text-sm">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={cn(
                    'rounded-2xl px-3 py-2',
                    message.role === 'user'
                      ? 'ml-8 bg-primary text-white'
                      : 'mr-8 bg-gray-50 text-text-primary dark:bg-white/5'
                  )}
                >
                  {message.content}
                </div>
              ))}
            </div>

            <div className="border-t border-border p-4">
              <div className="mb-3 flex flex-wrap gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => setInput(action.value)}
                    className="rounded-full border border-border bg-bg px-3 py-1.5 text-[11px] font-semibold text-text-muted transition hover:border-primary hover:text-primary"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => event.key === 'Enter' && submit()}
                  placeholder="Ask or type a command"
                  className="h-10 flex-1 rounded-xl border border-border bg-bg px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <Button size="sm" onClick={submit}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-primary text-white shadow-soft"
          aria-label={chatLabel}
        >
          <Bot className="h-6 w-6" />
          <span className="sr-only">{chatLabel}</span>
        </button>
      ) : null}
    </>
  );
};
