import { useRef } from 'react';
import type { ButtonHTMLAttributes, PointerEvent } from 'react';

type SpecularButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function SpecularButton({ className = '', children, onPointerMove, onPointerLeave, ...props }: SpecularButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const moveLight = (event: PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    event.currentTarget.style.setProperty('--specular-x', `${x}%`);
    event.currentTarget.style.setProperty('--specular-y', `${y}%`);
    event.currentTarget.style.setProperty('--specular-strength', '1');
    onPointerMove?.(event);
  };

  const resetLight = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.style.setProperty('--specular-x', '18%');
    event.currentTarget.style.setProperty('--specular-y', '0%');
    event.currentTarget.style.setProperty('--specular-strength', '.55');
    onPointerLeave?.(event);
  };

  return (
    <button
      {...props}
      ref={buttonRef}
      className={`specular-button${className ? ` ${className}` : ''}`}
      onPointerMove={moveLight}
      onPointerLeave={resetLight}
    >
      <span className="specular-button__shine" aria-hidden="true" />
      <span className="specular-button__label">{children}</span>
    </button>
  );
}
