import { useState } from 'react';
import QRModal from './QRModal';
import { Button } from '../shared/Button';

export default function QRButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        title="Share"
        aria-label="Share"
      >
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 512 512"
          fill="none"
        >
          <circle
            cx="128"
            cy="256"
            r="48"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="32"
          />
          <circle
            cx="384"
            cy="112"
            r="48"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="32"
          />
          <circle
            cx="384"
            cy="400"
            r="48"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="32"
          />
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="32"
            d="M169.83 279.53l172.34 96.94M342.17 135.53l-172.34 96.94"
          />
        </svg>
      </Button>
      {open && <QRModal onClose={() => setOpen(false)} />}
    </>
  );
}
