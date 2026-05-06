import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
  forwardRef,
} from 'react';

type Variant = 'default' | 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'md' | 'sm' | 'icon' | 'square';

const base =
  'inline-flex items-center justify-center gap-2 font-ui leading-none rounded-md ' +
  'cursor-pointer no-underline transition-[background-color,color,border-color,opacity] duration-150 ' +
  'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 ' +
  'disabled:opacity-40 disabled:cursor-not-allowed aria-disabled:opacity-40 aria-disabled:cursor-not-allowed';

const sizes: Record<Size, string> = {
  md: 'h-9 px-2.5 text-[13px] font-medium',
  sm: 'h-7 px-2.5 text-[12px] font-medium',
  icon: 'h-9 w-9 p-0 text-[13px] font-medium',
  square: 'h-6 w-6 p-0 gap-0 text-[13px] font-medium rounded-sm',
};

const variants: Record<Variant, string> = {
  default:
    'bg-bg-elevated text-fg border border-rule hover:bg-bg-subtle',
  primary:
    'bg-primary text-on-primary border border-primary font-semibold hover:opacity-90',
  secondary:
    'bg-bg-elevated text-fg-soft border border-transparent hover:bg-bg-subtle hover:text-fg',
  ghost:
    'bg-transparent text-fg-soft border border-transparent hover:bg-bg-subtle hover:text-fg',
  danger:
    'bg-transparent text-danger border border-transparent hover:bg-[color-mix(in_srgb,var(--color-danger)_12%,transparent)]',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  children?: ReactNode;
  className?: string;
}

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;
type AnchorProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function buttonClasses(variant: Variant = 'default', size: Size = 'md', extra = ''): string {
  return [base, sizes[size], variants[variant], extra].filter(Boolean).join(' ');
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'default', size = 'md', className = '', children, type = 'button', ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} className={buttonClasses(variant, size, className)} {...rest}>
      {children}
    </button>
  );
});

export const ButtonLink = forwardRef<HTMLAnchorElement, AnchorProps>(function ButtonLink(
  { variant = 'default', size = 'md', className = '', children, ...rest },
  ref,
) {
  return (
    <a ref={ref} className={buttonClasses(variant, size, className)} {...rest}>
      {children}
    </a>
  );
});
