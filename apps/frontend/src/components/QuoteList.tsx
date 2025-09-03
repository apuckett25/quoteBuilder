// components/QuoteList.tsx
import React, { useEffect, useState } from 'react';
import {
  Table,
  Pagination,
  Text,
  Button,
  Group,
  Stack,
  Badge,
  LoadingOverlay,
  Alert,
  Title,
  Card,
  TextInput,
  ActionIcon,
  Tooltip
} from '@mantine/core';
import { 
  IconEye, 
  IconEdit,
  IconAlertCircle, 
  IconSearch, 
  IconRefresh,
  IconCalendar,
  IconUser,
  IconMail,
  IconTrash
} from '@tabler/icons-react';
import { useDebouncedValue } from '@mantine/hooks';
import apiClient, { Quote, QuoteListResponse } from '../utils/api';
import QuoteDetails from './QuoteDetails';

const QuoteList: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalQuotes, setTotalQuotes] = useState(0);
  const [pageSize] = useState(25);
  
  // Modal state
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchQuery, 300);

  useEffect(() => {
    fetchQuotes();
  }, [currentPage, debouncedSearch]);

  const fetchQuotes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response: QuoteListResponse = await apiClient.getQuotes(currentPage, pageSize);
      setQuotes(response.data);
      setTotalPages(response.totalPages);
      setTotalQuotes(response.total);
    } catch (err) {
      setError('Failed to load quotes. Please try again.');
      console.error('Error fetching quotes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewQuote = (quoteId: string) => {
    setSelectedQuoteId(quoteId);
    setModalOpened(true);
    setIsEditing(false);
  };

  const handleEditQuote = (quoteId: string) => {
    setSelectedQuoteId(quoteId);
    setModalOpened(true);
    setIsEditing(true);
  };

  const handleCloseModal = () => {
    setModalOpened(false);
    setSelectedQuoteId(null);
    setIsEditing(false);
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    fetchQuotes();
  };

  const formatCurrency = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Number(amount));
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status: number | null | undefined) => {
    const statusMap: { [key: number]: { label: string; color: string } } = {
      0: { label: 'Draft', color: 'gray' },
      1: { label: 'Pending', color: 'yellow' },
      2: { label: 'Sent', color: 'blue' },
      3: { label: 'Accepted', color: 'green' },
      4: { label: 'Rejected', color: 'red' },
    };

    const statusInfo = statusMap[status ?? 0] || { label: 'Unknown', color: 'gray' };
    return <Badge color={statusInfo.color} size="sm">{statusInfo.label}</Badge>;
  };

  const filteredQuotes = quotes.filter(quote => {
    if (!debouncedSearch) return true;
    
    const searchLower = debouncedSearch.toLowerCase();
    return (
      quote.Name?.toLowerCase().includes(searchLower) ||
      quote.ProposalNumber?.toLowerCase().includes(searchLower) ||
      quote.ContactName?.toLowerCase().includes(searchLower) ||
      quote.ContactEmail?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Stack gap="lg">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <Title order={2}>Quote Management</Title>
          <Group>
            <TextInput
              placeholder="Search quotes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              leftSection={<IconSearch size={16} />}
              style={{ width: 300 }}
            />
            <Tooltip label="Refresh">
              <ActionIcon 
                variant="light" 
                onClick={handleRefresh}
                loading={loading}
              >
                <IconRefresh size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>

        <Group justify="space-between" mb="md">
          <Text c="dimmed">
            Showing {filteredQuotes.length} of {totalQuotes} quotes
          </Text>
        </Group>

        {error && (
          <Alert 
            icon={<IconAlertCircle size={16} />} 
            title="Error" 
            color="red" 
            mb="md"
          >
            {error}
            <Button 
              size="xs" 
              variant="light" 
              onClick={handleRefresh} 
              mt="xs"
            >
              Try Again
            </Button>
          </Alert>
        )}

        <div style={{ position: 'relative', minHeight: '400px' }}>
          <LoadingOverlay visible={loading} />
          
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Proposal #</Table.Th>
                <Table.Th>Customer</Table.Th>
                <Table.Th>Quote Name</Table.Th>
                <Table.Th>Contact</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Total</Table.Th>
                <Table.Th>Created</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredQuotes.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={7}>
                    <Text ta="center" c="dimmed" py="xl">
                      {loading ? 'Loading quotes...' : 'No quotes found'}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                filteredQuotes.map((quote) => (
                  <Table.Tr key={quote.ID}>
                    <Table.Td>
                      <Text size="sm" fw={600} c="blue">
                        #{quote.ProposalNumber}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" lineClamp={2}>
                        {quote.CustomerName || 'Unknown Customer'}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" lineClamp={2}>
                        {quote.Name || 'Untitled Quote'}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Stack gap={2}>
                        <Group gap={4} align="center">
                          <IconUser size={12} />
                          <Text size="xs">
                            {quote.ContactName || 'N/A'}
                          </Text>
                        </Group>
                        {quote.ContactEmail && (
                          <Group gap={4} align="center">
                            <IconMail size={12} />
                            <Text size="xs" c="dimmed">
                              {quote.ContactEmail}
                            </Text>
                          </Group>
                        )}
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      {getStatusBadge(quote.Status)}
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" fw={600}>
                        {formatCurrency(quote.QuoteTotal)}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={4} align="center">
                        <IconCalendar size={12} />
                        <Text size="xs">
                          {formatDate(quote.CreatedAt)}
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Tooltip label="View Details">
                        <ActionIcon
                          variant="light"
                          color="blue"
                          onClick={() => handleViewQuote(quote.ID)}
                        >
                          <IconEye size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Edit Details">
                        <ActionIcon
                          variant="light"
                          color="green"
                          onClick={() => handleEditQuote(quote.ID)}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Disable Quote">
                        <ActionIcon
                          variant="light"
                          color="red"
                          // onClick={() => handleDisableQuote(quote.ID)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>

          {totalPages > 1 && (
            <Group justify="center" mt="lg">
              <Pagination
                value={currentPage}
                onChange={setCurrentPage}
                total={totalPages}
                size="sm"
                withEdges
              />
            </Group>
          )}
        </div>
      </Card>

      <QuoteDetails
        opened={modalOpened}
        onClose={handleCloseModal}
        quoteId={selectedQuoteId}
        isEditing={isEditing}
      />
    </Stack>
  );
};

export default QuoteList;