import { APP_NAME } from '@/lib/config';

type LogoProps = {
  className?: string;
};

export default function Logo({ className = 'h-6 w-6' }: LogoProps) {
  return (
    <>
      <svg
        viewBox="0 0 24 24"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M 20 8 M 21 10 C 21 18 18.5 20.5 12 20.5 C 5.5 20.5 3.5 18.5 3.5 12 C 3.5 5.5 5 2 14 3 M 12 15 l 8.385 -8.415 a 2.1 2.1 0 0 0 -2.97 -2.97 l -8.415 8.385 v 3 h 3 M16 5l3 3" />
      </svg>
      <span className="text-[15px] max-[600px]:hidden">{APP_NAME}</span>
    </>
  );
}
