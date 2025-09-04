// components/ThemeToggle.tsx
import { ActionIcon, useMantineColorScheme, useComputedColorScheme, Tooltip } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import cx from 'clsx';

interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'light' | 'filled' | 'outline' | 'subtle';
}

export function ThemeToggle({ size = 'md', variant = 'default' }: ThemeToggleProps) {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  const isDark = computedColorScheme === 'dark';

  return (
    <Tooltip label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
      <ActionIcon
        onClick={() => setColorScheme(isDark ? 'light' : 'dark')}
        variant={variant}
        size={size}
        aria-label="Toggle color scheme"
      >
        {isDark ? (
          <IconSun size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} />
        ) : (
          <IconMoon size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} />
        )}
      </ActionIcon>
    </Tooltip>
  );
}