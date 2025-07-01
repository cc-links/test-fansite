import { cln } from '@x-vision/design'
import * as React from 'react'

export function Logo({
  ref,
  children,
  className,
  size = 'var(--named-large)',
  color = 'currentColor',
  ...props
}: React.ComponentProps<'svg'> & { color?: string; size?: string }) {
  return (
    <div
      className={cln(
        'inline-flex items-center justify-center gap-(--named-micro) whitespace-nowrap font-semibold text-block dark:text-white typography-text-heading3-strong',
        className,
      )}
    >
      <svg
        data-slot="logo"
        width="1em"
        height="1em"
        viewBox="0 0 162 162"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        fontSize={size}
        {...props}
        ref={ref}
      >
        <path
          d="M51 31.0083V25.9847C51 12.1586 39.8 1 26.0222 1C12.2 1 1 12.2031 1 25.9847L1 55.993C1 69.8191 12.2 80.9777 25.9778 81.0222L55.9778 81.0222C69.8 81.0222 80.9556 69.8191 80.9556 56.0375C80.9556 42.2114 69.7555 31.0083 55.9778 31.0083L50.9556 31.0083H51Z"
          fill={color}
        />
        <path
          d="M51 111.03V106.007C51 92.1808 39.8 81.0222 26.0222 81.0222C12.2 81.0222 1 92.2253 1 106.007L1 136.015C1 149.841 12.2 161.044 26.0222 161H56.0222C69.8444 161 81 149.797 81 136.015C81 122.189 69.8 110.986 56.0222 110.986H51V111.03Z"
          fill={color}
        />
        <path
          d="M131 111.03V106.007C131 92.1808 119.8 81.0222 106.022 81.0222C92.2 81.0222 81.0444 92.2253 81.0444 106.007V136.015C81.0444 149.841 92.2444 161 106.022 161H136.022C149.844 161 161 149.797 161 136.015C161 122.189 149.8 110.986 136.022 110.986H131V111.03Z"
          fill={color}
        />
      </svg>
      {children && <span data-slot="text">{children}</span>}
    </div>
  )
}

export default Logo
