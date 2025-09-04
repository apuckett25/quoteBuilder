// components/ThemeToggle.tsx
import { useState, useEffect } from 'react';
import { ActionIcon, useMantineColorScheme, Tooltip } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'light' | 'filled' | 'outline' | 'subtle';
}

export function ThemeToggle({ size = 'md', variant = 'default' }: ThemeToggleProps) {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const [mounted, setMounted] = useState(false);

  // This effect runs only on the client after the initial render
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = colorScheme === 'dark';

  // If the component is not mounted (i.e., on the server), render a placeholder or null
  if (!mounted) {
    return null; // Or <ActionIcon variant={variant} size={size} aria-label="Toggle color scheme" />;
  }

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