import { useMemo, useState } from 'react';
import qrcode from 'qrcode-generator';
import Modal from '../shared/Modal';
import { Button } from '../shared/Button';

interface Props {
  onClose: () => void;
}

export default function QRModal({ onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window === 'undefined' ? '' : window.location.href;

  const qrDataUrl = useMemo(() => {
    if (!shareUrl) return null;
    try {
      // Use byte length because QR capacity depends on encoded bytes, not JS string length.
      if (new TextEncoder().encode(shareUrl).length > 2953) {
        return null;
      }

      const qr = qrcode(0, 'L');
      qr.addData(shareUrl);
      qr.make();
      return qr.createDataURL(12, 4);
    } catch {
      return null;
    }
  }, [shareUrl]);

  const tooLargeForQr = !!shareUrl && !qrDataUrl && new TextEncoder().encode(shareUrl).length > 2953;

  const copyUrl = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Modal onClose={onClose} title="Share" wide>
      <div className="flex flex-col gap-5">
        {qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt="QR code for shared document URL"
            className="w-full max-w-[420px] aspect-square mx-auto rounded-md border border-rule bg-white p-3"
            style={{ imageRendering: 'pixelated' }}
          />
        ) : (
          <div className="flex items-center justify-center w-full max-w-[260px] aspect-square mx-auto rounded-md border-2 border-dashed border-rule bg-bg-subtle text-fg-faint font-ui text-[14px] px-6 text-center">
            <p>{tooLargeForQr ? 'URL is too large for QR code.' : 'Unable to generate QR code.'}</p>
          </div>
        )}
        <p className="font-ui text-[14px] text-fg-soft text-center">
          {qrDataUrl
            ? 'Scan this QR code to open this document on another device.'
            : 'You can still share this document by copying the URL below.'}
        </p>
        <div className="flex items-center gap-2 w-full">
          <input
            readOnly
            value={shareUrl}
            aria-label="Share URL"
            onFocus={e => e.currentTarget.select()}
            className="flex-1 min-w-0 rounded-md border border-rule bg-bg-elevated px-3.5 py-2.5 font-ui text-[14px] text-fg outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-fg-faint focus:border-primary focus:shadow-[0_0_0_3px_var(--color-primary-soft)]"
          />
          <Button variant="primary" onClick={copyUrl}>
            {copied ? 'Copied' : 'Copy URL'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
