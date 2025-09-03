// pages/index.tsx or components/MainPage.tsx
import React from 'react';
import { Container, Title, Text, Stack, AppShell } from '@mantine/core';
import QuoteList from '../components/QuoteList';

const MainPage: React.FC = () => {
  return (
    <AppShell>
      <AppShell.Main>
        <Container size="xl" py="xl">
          <Stack gap="lg">
            <div>
              <Title order={1} mb="xs">
                Quote Builder
              </Title>
              <Text c="dimmed" size="lg">
                Project management quotes for labor, materials, and other costs
              </Text>
            </div>
            
            <QuoteList />
          </Stack>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};

export default MainPage;