// pages/index.tsx
import React from 'react';
import { 
  Container, 
  Title, 
  Text, 
  Stack, 
  AppShell, 
  Group, 
  // Header,
  Flex,
  Paper,
  useMantineColorScheme,
  useComputedColorScheme
} from '@mantine/core';
import { IconBuildingFactory } from '@tabler/icons-react';
import QuoteList from '../components/QuoteList';
import { ThemeToggle } from '../components/ThemeToggle';

const MainPage: React.FC = () => {
  // const computedColorScheme = useComputedColorScheme('light');
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const isDark = computedColorScheme === 'dark';

  return (
    <AppShell
      header={{ height: 70 }}
      style={{
        backgroundColor: isDark ? 'var(--mantine-color-dark-7)' : 'var(--mantine-color-gray-0)',
      }}
    >
      <AppShell.Header>
        <Container size="xl" h="100%">
          <Flex justify="space-between" align="center" h="100%">
            <Group>
              <Paper
                p="sm"
                radius="md"
                style={{
                  backgroundColor: isDark 
                    ? 'var(--mantine-color-blue-8)' 
                    : 'var(--mantine-color-blue-1)',
                }}
              >
                <IconBuildingFactory 
                  size={24} 
                  color={isDark ? 'var(--mantine-color-blue-3)' : 'var(--mantine-color-blue-7)'}
                />
              </Paper>
              <div>
                <Title 
                  order={3} 
                  style={{ 
                    color: isDark ? 'var(--mantine-color-gray-1)' : 'var(--mantine-color-gray-9)' 
                  }}
                >
                  Quote Builder
                </Title>
                <Text 
                  size="sm" 
                  style={{ 
                    color: isDark ? 'var(--mantine-color-gray-4)' : 'var(--mantine-color-gray-6)' 
                  }}
                >
                  Project Management System
                </Text>
              </div>
            </Group>
            
            <Group>
              <ThemeToggle size="md" variant="light" />
            </Group>
          </Flex>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="xl" py="xl">
          <Stack gap="lg">
            <Paper
              p="xl"
              radius="lg"
              style={{
                background: isDark 
                  ? 'linear-gradient(135deg, var(--mantine-color-dark-6), var(--mantine-color-dark-5))'
                  : 'linear-gradient(135deg, var(--mantine-color-blue-0), var(--mantine-color-gray-0))',
                border: isDark 
                  ? '1px solid var(--mantine-color-dark-4)'
                  : '1px solid var(--mantine-color-gray-2)',
              }}
            >
              <Stack gap="md" align="center" ta="center">
                <Title 
                  order={1} 
                  size="2.5rem"
                  // style={{
                  //   background: isDark 
                  //     ? 'linear-gradient(45deg, var(--mantine-color-blue-4), var(--mantine-color-cyan-4))'
                  //     : 'linear-gradient(45deg, var(--mantine-color-blue-6), var(--mantine-color-cyan-6))',
                  //   WebkitBackgroundClip: 'text',
                  //   WebkitTextFillColor: 'transparent',
                  //   backgroundClip: 'text',
                  // }}
                >
                  Welcome to Quote Builder
                </Title>
                <Text 
                  size="lg" 
                  maw={600}
                  style={{ 
                    color: isDark ? 'var(--mantine-color-gray-3)' : 'var(--mantine-color-gray-7)' 
                  }}
                >
                  Manage project quotes efficiently with comprehensive tracking for labor, 
                  materials, and other costs. Create professional quotes and track their progress 
                  from draft to completion.
                </Text>
              </Stack>
            </Paper>
            
            <QuoteList />
          </Stack>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};

export default MainPage;