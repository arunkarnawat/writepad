import { useState } from 'react';
import { useAppStore } from '@/lib/store/appStore';
import { nanoid } from 'nanoid';
import { Button } from '../shared/Button';

export default function TodoInput() {
  const [text, setText] = useState('');
  const todos = useAppStore(s => s.todos);
  const setTodos = useAppStore(s => s.setTodos);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    const nextOrder = todos.length > 0 ? Math.max(...todos.map(t => t.order)) + 1 : 0;

    const newTodo = {
      id: nanoid(8),
      text: trimmed,
      completed: false,
      order: nextOrder,
      createdAt: Date.now(),
    };

    setTodos([...todos, newTodo]);
    setText('');
  };

  return (
    <form className="flex items-center gap-2 px-5 pt-1 pb-3.5 shrink-0" onSubmit={submit}>
      <input
        type="text"
        placeholder="Write a task…"
        value={text}
        onChange={e => setText(e.target.value)}
        aria-label="New task"
        className="flex-1 min-w-0 rounded-md border border-rule bg-bg-elevated px-3.5 py-2.5 font-ui text-[14px] text-fg outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-fg-faint focus:border-primary focus:shadow-[0_0_0_3px_var(--color-primary-soft)]"
      />
      <Button type="submit" variant="primary" disabled={!text.trim()}>
        Add
      </Button>
    </form>
  );
}
