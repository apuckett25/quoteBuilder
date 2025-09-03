import { Container, Title, Paper, Group, Text, Button, Loader } from '@mantine/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { fetchQuoteById, type Quote } from '../../utils/api';

export default function QuoteDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const loadQuote = async () => {
        try {
          const data = await fetchQuoteById(id as string);
          setQuote(data);
        } catch (err) {
          setError('Failed to load quote details');
        } finally {
          setLoading(false);
        }
      };
      loadQuote();
    }
  }, [id]);

  if (loading) return <Container><Loader /></Container>;
  if (error) return <Container><Text color="red">{error}</Text></Container>;
  if (!quote) return <Container><Text>Quote not found</Text></Container>;

  return (
    <Container size="lg" py="xl">
      <Paper shadow="xs" p="xl">
        <Group mb="xl">
          <Title order={2}>Quote Details</Title>
          <Button variant="light" onClick={() => router.back()}>
            Back to List
          </Button>
        </Group>

        <Group>
          <Text fw={500}>Proposal Number:</Text>
          <Text>{quote.ProposalNumber}</Text>
        </Group>

        <Group mt="md">
          <Text fw={500}>Name:</Text>
          <Text>{quote.Name}</Text>
        </Group>

        <Group mt="md">
          <Text fw={500}>Quote Total:</Text>
          <Text>${quote.QuoteTotal.toLocaleString()}</Text>
        </Group>

        <Group mt="md">
          <Text fw={500}>Created At:</Text>
          <Text>{new Date(quote.CreatedAt).toLocaleDateString()}</Text>
        </Group>
      </Paper>
    </Container>
  );
}