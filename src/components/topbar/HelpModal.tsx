import { useAppStore } from '@/lib/store/appStore';
import Modal from '../shared/Modal';
import { APP_NAME, APP_DESCRIPTION, GITHUB_URL, VERSION } from '@/lib/config';

const isMac =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
const Mod = isMac ? '⌘' : 'Ctrl';

interface ShortcutRow {
  keys: string[];
  label: string;
}

const TEXT_SHORTCUTS: ShortcutRow[] = [
  { keys: [Mod, 'B'], label: 'Bold' },
  { keys: [Mod, 'I'], label: 'Italic' },
  { keys: [Mod, 'U'], label: 'Underline' },
  { keys: [Mod, 'Shift', 'S'], label: 'Strikethrough' },
  { keys: [Mod, 'K'], label: 'Create link' },
];

const NAV_SHORTCUTS: ShortcutRow[] = [
  { keys: ['/'], label: 'Open slash menu (block commands)' },
  { keys: ['Enter'], label: 'New block / split block' },
  { keys: ['Tab'], label: 'Nest block (indent)' },
  { keys: ['Shift', 'Tab'], label: 'Unnest block (outdent)' },
  { keys: ['Backspace'], label: 'Delete block (when empty)' },
  { keys: [Mod, 'Z'], label: 'Undo' },
  { keys: [Mod, 'Shift', 'Z'], label: 'Redo' },
  { keys: ['Esc'], label: 'Close menus or popovers' },
];

const MARKDOWN_ROWS: { syntax: string; result: string; note?: string }[] = [
  { syntax: '#', result: 'Heading 1', note: 'followed by Space' },
  { syntax: '##', result: 'Heading 2', note: 'followed by Space' },
  { syntax: '###', result: 'Heading 3', note: 'followed by Space' },
  { syntax: '-', result: 'Bullet list', note: 'followed by Space' },
  { syntax: '1.', result: 'Numbered list', note: 'followed by Space' },
  { syntax: '[]', result: 'Check list', note: 'followed by Space' },
  { syntax: '>', result: 'Blockquote', note: 'followed by Space' },
  { syntax: '```', result: 'Code block', note: 'followed by Space' },
  { syntax: '**text**', result: 'Bold (inline)' },
  { syntax: '*text*', result: 'Italic (inline)' },
  { syntax: '~~text~~', result: 'Strikethrough (inline)' },
  { syntax: '`code`', result: 'Inline code' },
];

const SLASH_ITEMS: { name: string; desc: string }[] = [
  { name: 'Heading 1 / 2 / 3', desc: 'Section headings' },
  { name: 'Numbered List', desc: 'Ordered list' },
  { name: 'Bullet List', desc: 'Unordered list' },
  { name: 'Check List', desc: 'Todo-style checklist' },
  { name: 'Toggle List', desc: 'Collapsible content' },
  { name: 'Paragraph', desc: 'Plain text block' },
  { name: 'Quote', desc: 'Blockquote' },
  { name: 'Code Block', desc: 'Syntax-highlighted code' },
  { name: 'Table', desc: 'Data table' },
  { name: 'Divider', desc: 'Horizontal separator' },
  { name: 'Image', desc: 'Upload or embed an image' },
  { name: 'Video', desc: 'Embed a video' },
  { name: 'Audio', desc: 'Embed audio' },
  { name: 'File', desc: 'Attach a file' },
  { name: 'Emoji', desc: 'Insert an emoji' },
];

const sectionH = 'font-ui text-[12px] font-semibold text-fg-faint uppercase tracking-[0.06em] m-0 mb-1.5';
const para = 'font-ui text-[13.5px] leading-[1.55] text-fg-soft m-0';
const code = 'font-mono text-[12px] bg-bg-subtle border border-rule px-1.5 py-px rounded text-fg';
const kbd =
  'font-ui text-[11px] font-semibold text-fg bg-bg-subtle border border-rule border-b-2 px-[7px] py-px rounded-[5px] min-w-[22px] text-center';
const helpRow =
  'grid grid-cols-[170px_1fr] gap-3 items-center px-1 py-1 rounded-sm font-ui text-[13px] text-fg-soft hover:bg-bg-subtle';

function ShortcutSection({ title, rows }: { title: string; rows: ShortcutRow[] }) {
  return (
    <section className="flex flex-col gap-1.5">
      <h3 className={sectionH}>{title}</h3>
      <div className="flex flex-col gap-0.5">
        {rows.map(row => (
          <div className={helpRow} key={row.label}>
            <div className="inline-flex items-center gap-1 flex-wrap">
              {row.keys.map((k, i) => (
                <kbd className={kbd} key={i}>
                  {k}
                </kbd>
              ))}
            </div>
            <div className="text-[13px] text-fg">{row.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function HelpModal() {
  const patchUi = useAppStore(s => s.patchUi);
  const close = () => patchUi({ helpOpen: false });

  return (
    <Modal onClose={close} wide title={`Help · ${APP_NAME} ${VERSION}`}>
      <div className="flex flex-col gap-6 font-ui text-fg">
        <section className="flex flex-col gap-2">
          <p className="font-ui text-[15px] font-semibold text-fg m-0">{APP_DESCRIPTION}</p>
          <p className={para}>
            Your entire document lives in the URL — no account, no server. Copy the URL to share, bookmark to save, or
            paste it anywhere to keep collaborating.
          </p>
        </section>

        {/* ── Slash menu ────────────────────────────────────── */}
        <section className="flex flex-col gap-2">
          <h3 className={sectionH}>
            <code className={code}>/</code> Slash menu
          </h3>
          <p className={para}>
            Type <code className={code}>/</code> at the start of any empty block to open the command menu.
            Start typing to filter. Use <kbd className={kbd}>↑</kbd> <kbd className={kbd}>↓</kbd> to navigate and <kbd className={kbd}>Enter</kbd> to insert.
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 mt-1">
            {SLASH_ITEMS.map(item => (
              <div key={item.name} className="flex items-baseline gap-2 py-0.5">
                <span className="text-[13px] font-medium text-fg">{item.name}</span>
                <span className="text-[12px] text-fg-faint">— {item.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Markdown shortcuts ────────────────────────────── */}
        <section className="flex flex-col gap-1.5">
          <h3 className={sectionH}>Markdown shortcuts</h3>
          <p className={`${para} mb-1`}>
            Type these at the <strong className="text-fg">start of an empty block</strong> followed by <kbd className={kbd}>Space</kbd> to instantly convert the block.
            Inline shortcuts like <code className={code}>**bold**</code> work anywhere in text.
          </p>
          <div className="flex flex-col gap-0.5">
            {MARKDOWN_ROWS.map(row => (
              <div className={helpRow} key={row.syntax}>
                <div className="inline-flex items-center gap-1 flex-wrap">
                  <code className="font-mono text-[12px] bg-bg-subtle border border-rule px-2 py-0.5 rounded-[5px] text-fg">{row.syntax}</code>
                  {row.note && <span className="text-[11px] text-fg-faint">+ Space</span>}
                </div>
                <div className="text-[13px] text-fg">{row.result}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Keyboard shortcuts ────────────────────────────── */}
        <ShortcutSection title="Text formatting" rows={TEXT_SHORTCUTS} />
        <ShortcutSection title="Navigation & editing" rows={NAV_SHORTCUTS} />

        {/* ── Editor basics ──────────────────────────────────── */}
        <section className="flex flex-col gap-2">
          <h3 className={sectionH}>Editor basics</h3>
          <ul className="m-0 pl-[18px] flex flex-col gap-1.5 font-ui text-[13.5px] leading-[1.5] text-fg-soft list-disc marker:text-fg-faint">
            <li>Hover a block to see the drag handle — reorder or open the block menu.</li>
            <li>Select text to see the floating toolbar (bold, italic, link, color, etc.).</li>
            <li>Click the <strong className="text-fg">+</strong> button on the left to add a new block.</li>
            <li>
              Switch to <strong className="text-fg">View</strong> mode in the top bar for a clean, read-only layout.
            </li>
            <li>
              Use <strong className="text-fg">Download</strong> to export as plain text, Markdown, HTML, or PDF.
            </li>
          </ul>
        </section>

        {/* ── Sidebar & todos ────────────────────────────────── */}
        <section className="flex flex-col gap-2">
          <h3 className={sectionH}>Sidebar &amp; todos</h3>
          <ul className="m-0 pl-[18px] flex flex-col gap-1.5 font-ui text-[13.5px] leading-[1.5] text-fg-soft list-disc marker:text-fg-faint">
            <li>Drag the divider between editor and sidebar to resize (20–60%). Double-click to reset.</li>
            <li>Click the sidebar icon in the top bar to collapse or expand the panel.</li>
            <li>Active todos are draggable — grab the dotted handle to reorder by priority.</li>
            <li>Deleting an active task takes two clicks: the X arms a red trash icon, then click again to confirm.</li>
            <li>Completed items delete with a single click.</li>
          </ul>
        </section>

        {/* ── Privacy ────────────────────────────────────────── */}
        <section className="flex flex-col gap-2">
          <h3 className={sectionH}>Privacy</h3>
          <p className={para}>
            Nothing is sent to a server. The document is compressed into the URL hash and a copy is also saved to{' '}
            <code className={code}>localStorage</code> as a crash-safe backup.
          </p>
        </section>

        <section className="flex flex-row items-center gap-2 pt-1 border-t border-rule mt-1">
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="text-primary text-[13px] font-medium no-underline hover:underline">
            GitHub
          </a>
          <span className="text-fg-faint">·</span>
          <a href="/help" className="text-primary text-[13px] font-medium no-underline hover:underline">
            Open help page
          </a>
        </section>
      </div>
    </Modal>
  );
}
