import { useMemo, useState } from 'react';
import { useAppStore } from '@/lib/store/appStore';
import TodoItem from './TodoItem';
import TodoInput from './TodoInput';
import ModeToggle from '../topbar/ModeToggle';
import GithubLink from '../topbar/GithubLink';
import HelpButton from '../topbar/HelpButton';
import QRButton from '../topbar/QRButton';
import DownloadMenu from '../topbar/DownloadMenu';
import ThemeDropdown from '../topbar/ThemeDropdown';

export default function TodoSidebar() {
  const ui = useAppStore(s => s.ui);
  const todos = useAppStore(s => s.todos);
  const setTodos = useAppStore(s => s.setTodos);

  const { sidebarWidth, mobileSidebarOpen, sidebarCollapsed } = ui;
  const isHidden = sidebarCollapsed;

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  const { active, done } = useMemo(() => {
    const active = todos.filter(t => !t.completed).sort((a, b) => a.order - b.order);
    const done = todos.filter(t => t.completed).sort((a, b) => b.createdAt - a.createdAt);
    return { active, done };
  }, [todos]);


  const reorder = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    const list = todos;
    const activeSorted = list.filter(t => !t.completed).sort((a, b) => a.order - b.order);

    const fromIdx = activeSorted.findIndex(t => t.id === sourceId);
    const toIdx = activeSorted.findIndex(t => t.id === targetId);
    if (fromIdx < 0 || toIdx < 0) return;

    const next = activeSorted.slice();
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);

    const orderById = new Map(next.map((t, i) => [t.id, i]));
    setTodos(list.map(t => (orderById.has(t.id) ? { ...t, order: orderById.get(t.id)! } : t)));
  };

  const handleDragStart = (id: string) => {
    setDraggingId(id);
    setDropTargetId(null);
  };
  const handleDragOver = (id: string) => {
    if (!draggingId) return;
    if (id !== dropTargetId) setDropTargetId(id);
  };
  const handleDrop = (id: string) => {
    if (draggingId) reorder(draggingId, id);
    setDraggingId(null);
    setDropTargetId(null);
  };
  const handleDragEnd = () => {
    setDraggingId(null);
    setDropTargetId(null);
  };

  const total = active.length + done.length;

  // Sidebar uses a CSS transition on `width`; on mobile we instead slide it in
  // from the right via a fixed overlay. Styles below combine both modes.
  // Avoid `min-w-[260px]` while collapsed: Tailwind can resolve conflicting
  // min-width utilities in source order, leaving a visible strip beside the editor.
  const desktopBase = [
    'flex flex-col shrink-0 relative h-full overflow-hidden bg-bg-subtle border-l border-rule',
    isHidden ? 'min-w-0 max-w-0 border-l-0' : 'min-w-[260px]',
    'transition-[width,min-width,max-width,transform,border-color] duration-[220ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]',
  ].join(' ');

  const collapsedClasses = isHidden ? 'pointer-events-none [&>*]:invisible' : '';

  const mobileClasses =
    'max-[900px]:fixed max-[900px]:top-[52px] max-[900px]:right-0 max-[900px]:bottom-0 max-[900px]:left-0 ' +
    'max-[900px]:!w-full max-[900px]:max-w-none max-[900px]:z-[1000] ' +
    'max-[900px]:translate-x-full max-[900px]:border-l-0 max-[900px]:shadow-none';

  const mobileOpenClasses = mobileSidebarOpen
    ? 'max-[900px]:!translate-x-0 max-[900px]:pointer-events-auto'
    : '';

  return (
    <aside
      className={[desktopBase, collapsedClasses, mobileClasses, mobileOpenClasses]
        .filter(Boolean)
        .join(' ')}
      style={{ width: isHidden ? 0 : `${sidebarWidth}%` }}
      aria-hidden={isHidden}
    >
      <div className="hidden max-[900px]:flex flex-wrap items-center justify-between gap-1.5 px-4 pt-3 pb-2 border-b border-rule">
        <ModeToggle />
        <div className="flex items-center gap-1.5">
          <QRButton />
          <HelpButton />
          <DownloadMenu />
          <ThemeDropdown />
        </div>
      </div>

      <header className="flex items-center justify-between gap-2.5 pt-[18px] pr-5 pb-3 pl-5 shrink-0">
        <div className="flex items-baseline gap-2.5">
          <h2 className="font-display text-[22px] font-bold text-fg tracking-[-0.01em] m-0">TODO</h2>
          {total > 0 && (
            <span className="font-ui text-[12px] font-medium text-fg-faint tabular-nums">
              {active.length}/{total}
            </span>
          )}
        </div>
      </header>

      <TodoInput />

      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-4 pt-1 pb-6">
        {active.length === 0 && done.length === 0 && (
          <div className="text-center py-10 px-3 text-fg-faint">
            <p className="font-ui text-[14px] font-semibold text-fg-soft m-0 mb-1">No tasks yet</p>
            <p className="font-ui text-[12px] m-0">Add one above to get started.</p>
          </div>
        )}

        {active.length > 0 && (
          <ul className="list-none m-0 p-0 flex flex-col gap-2">
            {active.map(todo => (
              <li key={todo.id}>
                <TodoItem
                  todo={todo}
                  isDragging={draggingId === todo.id}
                  isDropTarget={dropTargetId === todo.id && draggingId !== todo.id}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                  onDrop={handleDrop}
                />
              </li>
            ))}
          </ul>
        )}

        {done.length > 0 && (
          <>
            <h3 className="font-ui text-[11px] font-semibold text-fg-faint mt-[22px] mb-2.5 mx-1 tracking-[0.08em] uppercase">
              Completed · {done.length}
            </h3>
            <ul className="list-none m-0 p-0 flex flex-col gap-2">
              {done.map(todo => (
                <li key={todo.id}>
                  <TodoItem
                    todo={todo}
                    isDragging={false}
                    isDropTarget={false}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                    onDrop={handleDrop}
                  />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </aside>
  );
}
