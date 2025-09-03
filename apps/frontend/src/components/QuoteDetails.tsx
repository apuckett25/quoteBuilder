// components/QuoteDetails.tsx
import React, { useEffect, useState } from 'react';
import {
  Modal,
  Tabs,
  Table,
  Text,
  Group,
  Stack,
  Badge,
  LoadingOverlay,
  Alert,
  Title,
  Divider,
  Card,
  Grid,
  NumberFormatter,
  Button,
  ActionIcon
} from '@mantine/core';
import { IconAlertCircle, IconCalendar, IconUser, IconMail, IconEdit, IconTrash, IconEye } from '@tabler/icons-react';
import apiClient, { 
  QuoteDetailsResponse, 
  LaborItem, 
  MaterialItem, 
  OtherItem, 
  PerDiemItem 
} from '../utils/api';

interface QuoteDetailsProps {
  opened: boolean;
  onClose: () => void;
  quoteId: string | null;
  isEditing?: boolean;
}

const QuoteDetails: React.FC<QuoteDetailsProps> = ({ opened, onClose, quoteId, isEditing }) => {
  const [quoteData, setQuoteData] = useState<QuoteDetailsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editModalOpened, setEditModalOpened] = useState(isEditing);

  useEffect(() => {
    if (opened && quoteId) {
      fetchQuoteDetails();
    }
  }, [opened, quoteId]);

  useEffect(() => {
    setEditModalOpened(isEditing);
  }, [isEditing]);

  const fetchQuoteDetails = async () => {
    if (!quoteId) return;

    setLoading(true);
    setError(null);
    
    try {
      const data = await apiClient.getQuoteDetails(quoteId);
      setQuoteData(data);
    } catch (err) {
      setError('Failed to load quote details. Please try again.');
      console.error('Error fetching quote details:', err);
    } finally {
      setLoading(false);
    }
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
    return <Badge color={statusInfo.color}>{statusInfo.label}</Badge>;
  };

  const renderLaborTab = () => {
    if (!quoteData?.laborItems?.length) {
      return <Text c="dimmed">No labor items found for this quote.</Text>;
    }

    return (
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={4}>Labor Items</Title>
          <Text size="lg" fw={600}>
            Total: {formatCurrency(quoteData.totals.labor)}
          </Text>
        </Group>
        
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Description</Table.Th>
              <Table.Th>Discipline</Table.Th>
              <Table.Th>Skill</Table.Th>
              <Table.Th>Total Hours</Table.Th>
              <Table.Th>Bill Rate</Table.Th>
              <Table.Th>Total Billable</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {quoteData.laborItems.map((item: LaborItem) => (
              <Table.Tr key={item.Id}>
                <Table.Td>
                  <Text size="sm">{item.Description || 'N/A'}</Text>
                </Table.Td>
                <Table.Td>
                  <Badge variant="light" size="sm">
                    {item.DisciplineName}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" title={item.SkillDescription}>
                    {item.SkillName}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{item.TotalHours}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{formatCurrency(item.BillRate)}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" fw={600}>
                    {formatCurrency(item.TotalBillable)}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <ActionIcon
                    variant="light"
                    color="blue"
                    // onClick={() => handleEditQuote(quote.ID)}
                  >
                    <IconEye size={16} />
                  </ActionIcon>
                  <ActionIcon
                    variant="light"
                    color="green"
                    // onClick={() => handleEditQuote(quote.ID)}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon
                    variant="light"
                    color="red"
                    // onClick={() => handleEditQuote(quote.ID)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Stack>
    );
  };

  const renderMaterialsTab = () => {
    if (!quoteData?.materialItems?.length) {
      return <Text c="dimmed">No material items found for this quote.</Text>;
    }

    return (
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={4}>Material Items</Title>
          <Text size="lg" fw={600}>
            Total: {formatCurrency(quoteData.totals.materials)}
          </Text>
        </Group>
        
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Description</Table.Th>
              <Table.Th>Discipline</Table.Th>
              <Table.Th>Cost</Table.Th>
              <Table.Th>Markup</Table.Th>
              <Table.Th>Billable</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {quoteData.materialItems.map((item: MaterialItem) => (
              <Table.Tr key={item.Id}>
                <Table.Td>
                  <Text size="sm">{item.Description || 'N/A'}</Text>
                </Table.Td>
                <Table.Td>
                  <Badge variant="light" size="sm">
                    {item.DisciplineName}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{formatCurrency(item.Cost)}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">
                    <NumberFormatter 
                      value={item.Markup} 
                      suffix="%" 
                      decimalScale={1}
                    />
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" fw={600}>
                    {formatCurrency(item.Billable)}
                  </Text>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Stack>
    );
  };

  const renderOtherTab = () => {
    if (!quoteData?.otherItems?.length) {
      return <Text c="dimmed">No other cost items found for this quote.</Text>;
    }

    return (
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={4}>Other Costs</Title>
          <Text size="lg" fw={600}>
            Total: {formatCurrency(quoteData.totals.other)}
          </Text>
        </Group>
        
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Description</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Discipline</Table.Th>
              <Table.Th>Cost</Table.Th>
              <Table.Th>Markup</Table.Th>
              <Table.Th>Billable</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {quoteData.otherItems.map((item: OtherItem) => (
              <Table.Tr key={item.Id}>
                <Table.Td>
                  <Text size="sm">{item.Description || 'N/A'}</Text>
                </Table.Td>
                <Table.Td>
                  <Badge variant="outline" size="sm">
                    {item.OtherTypeName}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Badge variant="light" size="sm">
                    {item.DisciplineName}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{formatCurrency(item.Cost)}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{formatCurrency(item.Markup)}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" fw={600}>
                    {formatCurrency(item.Billable)}
                  </Text>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Stack>
    );
  };

  const renderPerDiemTab = () => {
    if (!quoteData?.perDiemItems?.length) {
      return <Text c="dimmed">No per diem items found for this quote.</Text>;
    }

    return (
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={4}>Per Diem</Title>
          <Text size="lg" fw={600}>
            Total: {formatCurrency(quoteData.totals.perDiem)}
          </Text>
        </Group>
        
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Discipline</Table.Th>
              <Table.Th>Employees</Table.Th>
              <Table.Th>Days</Table.Th>
              <Table.Th>Pay Rate</Table.Th>
              <Table.Th>Bill Rate</Table.Th>
              <Table.Th>Pay Total</Table.Th>
              <Table.Th>Bill Total</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {quoteData.perDiemItems.map((item: PerDiemItem) => (
              <Table.Tr key={item.ID}>
                <Table.Td>
                  <Badge variant="light" size="sm">
                    {item.DisciplineName}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{item.NumOfEmployees}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{item.NumOfDays}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{formatCurrency(item.PerDiemPayRate)}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{formatCurrency(item.PerDiemBillRate)}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{formatCurrency(item.PerDiemPayTotal)}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" fw={600}>
                    {formatCurrency(item.PerDiemBillTotal)}
                  </Text>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Stack>
    );
  };

  const renderSummaryTab = () => {
    if (!quoteData) return null;

    return (
      <Stack gap="lg">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Title order={4}>Quote Information</Title>
            <Grid>
              <Grid.Col span={6}>
                <Group gap="xs">
                  <IconUser size={16} />
                  <Text size="sm" c="dimmed">Contact:</Text>
                  <Text size="sm">{quoteData.quote.ContactName || 'N/A'}</Text>
                </Group>
              </Grid.Col>
              <Grid.Col span={6}>
                <Group gap="xs">
                  <IconMail size={16} />
                  <Text size="sm" c="dimmed">Email:</Text>
                  <Text size="sm">{quoteData.quote.ContactEmail || 'N/A'}</Text>
                </Group>
              </Grid.Col>
              <Grid.Col span={6}>
                <Group gap="xs">
                  <IconCalendar size={16} />
                  <Text size="sm" c="dimmed">Created:</Text>
                  <Text size="sm">{formatDate(quoteData.quote.CreatedAt)}</Text>
                </Group>
              </Grid.Col>
              <Grid.Col span={6}>
                <Group gap="xs">
                  <Text size="sm" c="dimmed">Status:</Text>
                  {getStatusBadge(quoteData.quote.Status)}
                </Group>
              </Grid.Col>
            </Grid>
          </Stack>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Title order={4}>Cost Breakdown</Title>
            <Grid>
              <Grid.Col span={6}>
                <Group justify="space-between">
                  <Text>Labor:</Text>
                  <Text fw={600}>{formatCurrency(quoteData.totals.labor)}</Text>
                </Group>
              </Grid.Col>
              <Grid.Col span={6}>
                <Group justify="space-between">
                  <Text>Materials:</Text>
                  <Text fw={600}>{formatCurrency(quoteData.totals.materials)}</Text>
                </Group>
              </Grid.Col>
              <Grid.Col span={6}>
                <Group justify="space-between">
                  <Text>Other Costs:</Text>
                  <Text fw={600}>{formatCurrency(quoteData.totals.other)}</Text>
                </Group>
              </Grid.Col>
              <Grid.Col span={6}>
                <Group justify="space-between">
                  <Text>Per Diem:</Text>
                  <Text fw={600}>{formatCurrency(quoteData.totals.perDiem)}</Text>
                </Group>
              </Grid.Col>
            </Grid>
            <Divider />
            <Group justify="space-between">
              <Text size="lg" fw={700}>Grand Total:</Text>
              <Text size="lg" fw={700} c="blue">
                {formatCurrency(quoteData.totals.grandTotal)}
              </Text>
            </Group>
          </Stack>
        </Card>
      </Stack>
    );
  };

  if (!opened) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        quoteData ? (
          <Group>
            <Text size="lg" fw={600}>
              {quoteData.quote.Name || `Quote ${quoteData.quote.ProposalNumber}`}
            </Text>
            <Badge variant="light">
              #{quoteData.quote.ProposalNumber}
            </Badge>
          </Group>
        ) : (
          'Quote Details'
        )
      }
      size="xl"
      padding="lg"
    >
      <div style={{ position: 'relative', minHeight: '400px' }}>
        <LoadingOverlay visible={loading} />
        
        {error && (
          <Alert 
            icon={<IconAlertCircle size={16} />} 
            title="Error" 
            color="red" 
            mb="md"
          >
            {error}
          </Alert>
        )}

        {quoteData && (
          <Tabs defaultValue="summary">
            <Tabs.List>
              <Tabs.Tab value="summary">Summary</Tabs.Tab>
              <Tabs.Tab value="labor">Labor</Tabs.Tab>
              <Tabs.Tab value="materials">Materials</Tabs.Tab>
              <Tabs.Tab value="other">Other</Tabs.Tab>
              <Tabs.Tab value="perdiem">Per Diem</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="summary" pt="md">
              {renderSummaryTab()}
            </Tabs.Panel>

            <Tabs.Panel value="labor" pt="md">
              {renderLaborTab()}
            </Tabs.Panel>

            <Tabs.Panel value="materials" pt="md">
              {renderMaterialsTab()}
            </Tabs.Panel>

            <Tabs.Panel value="other" pt="md">
              {renderOtherTab()}
            </Tabs.Panel>

            <Tabs.Panel value="perdiem" pt="md">
              {renderPerDiemTab()}
            </Tabs.Panel>
          </Tabs>
        )}
      </div>
    </Modal>
  );
};

export default QuoteDetails;