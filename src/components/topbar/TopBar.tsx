import { useAppStore } from '@/lib/store/appStore';
import ModeToggle from './ModeToggle';
import NewDocButton from './NewDocButton';
import QRButton from './QRButton';
import DownloadMenu from './DownloadMenu';
import GithubLink from './GithubLink';
import HelpButton from './HelpButton';
import ThemeDropdown from './ThemeDropdown';
import MobileSidebarToggle from '../sidebar/MobileSidebarToggle';
import { APP_NAME } from '@/lib/config';

export default function TopBar() {
  const documentTitle = useAppStore(s => s.documentTitle);

  return (
    <header className="flex items-center justify-between gap-4 h-[52px] px-5 py-2.5 border-b border-rule bg-bg shrink-0 z-[100] max-[600px]:px-3 max-[600px]:py-2 max-[600px]:gap-2">
      <div className="flex items-center min-w-0 gap-3 flex-1">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-primary font-ui font-semibold shrink-0 hover:opacity-85"
          aria-label={`${APP_NAME} home`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className="text-[15px] max-[600px]:hidden">{APP_NAME}</span>
        </a>

        <ModeToggle />

        <span className="w-px h-[22px] bg-rule shrink-0 max-[600px]:hidden" aria-hidden="true" />

        <span
          className="font-ui text-[14px] font-semibold text-fg tracking-[-0.01em] whitespace-nowrap overflow-hidden text-ellipsis min-w-0 max-[600px]:text-[13px]"
          title={documentTitle}
        >
          {documentTitle}
        </span>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <NewDocButton />
        <GithubLink />
        <HelpButton />
        <QRButton />
        <DownloadMenu />
        <ThemeDropdown />
        <span className="w-px h-[22px] bg-rule mx-1 self-center" aria-hidden="true" />
        <MobileSidebarToggle />
      </div>
    </header>
  );
}
