import { useEffect, useRef, useState } from 'react';
import type { Todo } from '@/lib/schema/types';
import { useAppStore } from '@/lib/store/appStore';
import { formatRelativeTime } from '@/lib/utils/relativeTime';

interface Props {
  todo: Todo;
  isDragging: boolean;
  isDropTarget: boolean;
  onDragStart: (id: string) => void;
  onDragOver: (id: string) => void;
  onDragEnd: () => void;
  onDrop: (id: string) => void;
}

const CONFIRM_TIMEOUT_MS = 2500;

export default function TodoItem({
  todo,
  isDragging,
  isDropTarget,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
}: Props) {
  const [confirming, setConfirming] = useState(false);
  const nowTick = useAppStore(s => s.nowTick);
  const setTodos = useAppStore(s => s.setTodos);
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!confirming) return;
    const handle = window.setTimeout(() => setConfirming(false), CONFIRM_TIMEOUT_MS);
    return () => window.clearTimeout(handle);
  }, [confirming]);

  const toggle = () => {
    setTodos(list => list.map(t => (t.id === todo.id ? { ...t, completed: !t.completed } : t)));
  };

  const remove = () => {
    setTodos(list => list.filter(t => t.id !== todo.id));
  };

  const onDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (todo.completed) {
      remove();
      return;
    }
    if (confirming) {
      remove();
    } else {
      setConfirming(true);
    }
  };

  const draggable = !todo.completed;

  const handleDragStart = (e: React.DragEvent) => {
    if (!draggable) {
      e.preventDefault();
      return;
    }
    onDragStart(todo.id);
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      try {
        e.dataTransfer.setData('text/plain', todo.id);
      } catch {
        /* ignore */
      }
      if (itemRef.current) e.dataTransfer.setDragImage(itemRef.current, 12, 12);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (todo.completed) return;
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    onDragOver(todo.id);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (todo.completed) return;
    e.preventDefault();
    onDrop(todo.id);
  };

  const itemClasses = [
    'group relative grid grid-cols-[auto_1fr_auto_auto] items-center gap-2.5 rounded-md p-3 cursor-default',
    'transition-[border-color,box-shadow,transform,opacity,background-color] duration-150',
    todo.completed
      ? 'bg-bg-subtle border border-rule/50 opacity-60 hover:opacity-80 hover:bg-bg-elevated hover:border-rule'
      : 'bg-bg-elevated border border-rule hover:border-[color-mix(in_srgb,var(--color-fg)_14%,transparent)] hover:shadow-soft',
    confirming && !todo.completed
      ? 'border-[color-mix(in_srgb,var(--color-danger)_40%,var(--color-rule))]'
      : '',
    isDragging ? 'opacity-50 cursor-grabbing' : '',
    isDropTarget ? 'border-primary shadow-[0_0_0_2px_var(--color-primary-soft)]' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const checkClasses = [
    'flex items-center justify-center w-[18px] h-[18px] rounded-[5px] border-[1.5px] cursor-pointer p-0 shrink-0 transition-[background-color,border-color] duration-150 text-on-primary',
    todo.completed
      ? 'bg-primary border-primary'
      : 'bg-bg-elevated border-rule hover:border-primary',
  ].join(' ');

  const deleteClasses = [
    'flex items-center justify-center bg-transparent border-0 cursor-pointer p-1 rounded-sm transition-[opacity,color,background-color] duration-150',
    confirming
      ? 'opacity-100 text-danger bg-[color-mix(in_srgb,var(--color-danger)_12%,transparent)]'
      : 'opacity-0 text-fg-faint group-hover:opacity-100 group-focus-within:opacity-100 hover:text-danger hover:bg-[color-mix(in_srgb,var(--color-danger)_10%,transparent)]',
  ].join(' ');

  return (
    <div
      ref={itemRef}
      className={itemClasses}
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnd={onDragEnd}
    >
      <button
        type="button"
        className={checkClasses}
        onClick={toggle}
        aria-pressed={todo.completed}
        aria-label={todo.completed ? 'Mark as not done' : 'Mark as done'}
      >
        {todo.completed && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>

      <div className="flex flex-col gap-0.5 min-w-0">
        <span
          className={[
            'font-ui text-[14px] leading-[1.35] break-words transition-colors duration-150',
            todo.completed ? 'text-fg-faint line-through' : 'text-fg',
          ].join(' ')}
        >
          {todo.text}
        </span>
        <span
          className="font-ui text-[11px] text-fg-faint tabular-nums"
          title={new Date(todo.createdAt).toLocaleString()}
        >
          created {formatRelativeTime(todo.createdAt, nowTick)}
        </span>
      </div>

      <button
        type="button"
        className={deleteClasses}
        onClick={onDeleteClick}
        aria-label={confirming ? 'Confirm delete' : 'Delete todo'}
        title={confirming ? 'Click again to delete' : 'Delete'}
      >
        {confirming ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18" />
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        )}
      </button>

      {draggable && (
        <span
          className={[
            'flex items-center justify-center px-0.5 cursor-grab text-fg-faint transition-[opacity,color] duration-150',
            'opacity-45 group-hover:opacity-100 group-hover:text-fg-soft',
            isDragging ? 'cursor-grabbing' : '',
          ].join(' ')}
          aria-hidden="true"
        >
          <svg width="12" height="18" viewBox="0 0 12 18" fill="currentColor">
            <circle cx="3" cy="3" r="1.3" />
            <circle cx="9" cy="3" r="1.3" />
            <circle cx="3" cy="9" r="1.3" />
            <circle cx="9" cy="9" r="1.3" />
            <circle cx="3" cy="15" r="1.3" />
            <circle cx="9" cy="15" r="1.3" />
          </svg>
        </span>
      )}
    </div>
  );
}
