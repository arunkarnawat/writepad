import { Button } from '../shared/Button';

export default function NewDocButton() {
  const handleClick = () => {
    window.open(`${window.location.origin}${window.location.pathname}#new`, '_blank', 'noopener,noreferrer');
  };

  return (
    <Button variant="primary" onClick={handleClick} title="New Document">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
        <path d="M12 5v14M5 12h14" />
      </svg>
      <span className="max-[1100px]:hidden">New</span>
    </Button>
  );
}
