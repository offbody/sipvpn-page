import { useRef } from 'react';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, PointerEvent, ReactNode } from 'react';

type SpecularVariant = 'dark' | 'light' | 'outline';
type SpecularButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: SpecularVariant };
type SpecularLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: SpecularVariant };

function positionLight(element: HTMLElement, clientX: number, clientY: number) {
  const rect = element.getBoundingClientRect();
  const x = ((clientX - rect.left) / rect.width) * 100;
  const y = ((clientY - rect.top) / rect.height) * 100;
  element.style.setProperty('--specular-x', `${x}%`);
  element.style.setProperty('--specular-y', `${y}%`);
  element.style.setProperty('--specular-strength', '1');
}

function restoreLight(element: HTMLElement) {
  element.style.setProperty('--specular-x', '18%');
  element.style.setProperty('--specular-y', '0%');
  element.style.setProperty('--specular-strength', '.55');
}

function SpecularContent({ children }: { children: ReactNode }) {
  return (
    <>
      <span className="specular-button__shine" aria-hidden="true" />
      <span className="specular-button__label">{children}</span>
    </>
  );
}

export default function SpecularButton({ className = '', children, variant = 'dark', onPointerMove, onPointerLeave, ...props }: SpecularButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
      positionLight(event.currentTarget, event.clientX, event.clientY);
    }
    onPointerMove?.(event);
  };

  const handlePointerLeave = (event: PointerEvent<HTMLButtonElement>) => {
    restoreLight(event.currentTarget);
    onPointerLeave?.(event);
  };

  return (
    <button
      {...props}
      ref={buttonRef}
      className={`specular-button specular-button--${variant}${className ? ` ${className}` : ''}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <SpecularContent>{children}</SpecularContent>
    </button>
  );
}

export function SpecularLink({ className = '', children, variant = 'light', onPointerMove, onPointerLeave, ...props }: SpecularLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);

  const moveLinkLight = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
      positionLight(event.currentTarget, event.clientX, event.clientY);
    }
    onPointerMove?.(event);
  };

  const resetLinkLight = (event: PointerEvent<HTMLAnchorElement>) => {
    restoreLight(event.currentTarget);
    onPointerLeave?.(event);
  };

  return (
    <a
      {...props}
      ref={linkRef}
      className={`specular-button specular-button--${variant}${className ? ` ${className}` : ''}`}
      onPointerMove={moveLinkLight}
      onPointerLeave={resetLinkLight}
    >
      <SpecularContent>{children}</SpecularContent>
    </a>
  );
}
