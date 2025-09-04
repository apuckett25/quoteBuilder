// components/QuoteDetails.tsx
import React, { useEffect, useState } from 'react';
import {
  Modal, Tabs, Table, Text, Group, Stack, Badge, LoadingOverlay, Alert,
  Title, Divider, Card, Grid, NumberFormatter, Button, ActionIcon, TextInput, Select
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle, IconCalendar, IconUser, IconMail, IconEdit, IconTrash, IconEye, IconDeviceFloppy } from '@tabler/icons-react';
import apiClient, { 
  Quote, QuoteDetailsResponse, LaborItem, MaterialItem, OtherItem, PerDiemItem 
} from '../utils/api';

interface QuoteDetailsProps {
  opened: boolean;
  onClose: () => void;
  quoteId: string | null;
  isEditing?: boolean;
}

const QuoteDetails: React.FC<QuoteDetailsProps> = ({ opened, onClose, quoteId, isEditing = false }) => {
  const [quoteData, setQuoteData] = useState<QuoteDetailsResponse | null>(null);
  const [editableQuote, setEditableQuote] = useState<Partial<Quote>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (opened && quoteId) {
      fetchQuoteDetails();
    } else {
      setQuoteData(null); // Clear data when modal is closed
    }
  }, [opened, quoteId]);

  useEffect(() => {
    if (quoteData) {
        setEditableQuote(quoteData.quote);
    }
  }, [quoteData]);

  const fetchQuoteDetails = async () => {
    if (!quoteId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.getQuoteDetails(quoteId);
      setQuoteData(data);
    } catch (err) {
      setError('Failed to load quote details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field: keyof Quote, value: any) => {
    setEditableQuote(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    if (!quoteId) return;
    setSaving(true);
    try {
        const updatedQuote = await apiClient.updateQuote(quoteId, editableQuote);
        // Optimistically update local state
        if (quoteData) {
            setQuoteData(prev => prev ? ({ ...prev, quote: updatedQuote }) : null);
        }
        notifications.show({
            title: 'Success',
            message: 'Quote details have been updated.',
            color: 'green'
        });
        onClose(); // Close modal on successful save
    } catch (err) {
        notifications.show({
            title: 'Error',
            message: 'Failed to save changes. Please try again.',
            color: 'red'
        });
    } finally {
        setSaving(false);
    }
  };

  // --- Helper Functions (No Changes) ---
  const formatCurrency = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) return '$0.00';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(amount));
  };
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };
  const statusOptions = [
    { value: '0', label: 'Draft' }, { value: '1', label: 'Pending' },
    { value: '2', label: 'Sent' }, { value: '3', label: 'Accepted' },
    { value: '4', label: 'Rejected' },
  ];
  const getStatusBadge = (status: number | null | undefined) => {
    const statusInfo = statusOptions.find(opt => opt.value === String(status)) || { label: 'Unknown' };
    const statusColorMap: { [key: string]: string } = {
        'Draft': 'gray', 'Pending': 'yellow', 'Sent': 'blue', 'Accepted': 'green', 'Rejected': 'red', 'Unknown': 'gray'
    };
    return <Badge color={statusColorMap[statusInfo.label]}>{statusInfo.label}</Badge>;
  };
  // --- END Helper Functions ---

  const renderSummaryTab = () => {
    if (!quoteData) return null;

    if (isEditing) {
        return (
            <Stack gap="lg">
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Stack gap="md">
                        <Title order={4}>Edit Quote Information</Title>
                        <Grid>
                            <Grid.Col span={12}>
                                <TextInput label="Quote Name" value={editableQuote.Name || ''} onChange={(e) => handleFieldChange('Name', e.currentTarget.value)} />
                            </Grid.Col>
                             <Grid.Col span={6}>
                                <TextInput label="Contact Name" value={editableQuote.ContactName || ''} onChange={(e) => handleFieldChange('ContactName', e.currentTarget.value)} />
                            </Grid.Col>
                             <Grid.Col span={6}>
                                <TextInput label="Contact Email" value={editableQuote.ContactEmail || ''} onChange={(e) => handleFieldChange('ContactEmail', e.currentTarget.value)} />
                            </Grid.Col>
                             <Grid.Col span={6}>
                                <Select label="Status" data={statusOptions} value={String(editableQuote.Status ?? '0')} onChange={(value) => handleFieldChange('Status', Number(value))} />
                            </Grid.Col>
                        </Grid>
                    </Stack>
                </Card>
            </Stack>
        )
    }

    return (
      <Stack gap="lg">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Title order={4}>Quote Information</Title>
            <Grid>
              <Grid.Col span={6}><Group gap="xs"><IconUser size={16} /><Text c="dimmed">Contact:</Text><Text>{quoteData.quote.ContactName || 'N/A'}</Text></Group></Grid.Col>
              <Grid.Col span={6}><Group gap="xs"><IconMail size={16} /><Text c="dimmed">Email:</Text><Text>{quoteData.quote.ContactEmail || 'N/A'}</Text></Group></Grid.Col>
              <Grid.Col span={6}><Group gap="xs"><IconCalendar size={16} /><Text c="dimmed">Created:</Text><Text>{formatDate(quoteData.quote.CreatedAt)}</Text></Group></Grid.Col>
              <Grid.Col span={6}><Group gap="xs"><Text c="dimmed">Status:</Text>{getStatusBadge(quoteData.quote.Status)}</Group></Grid.Col>
            </Grid>
          </Stack>
        </Card>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Title order={4}>Cost Breakdown</Title>
            <Grid>
              <Grid.Col span={6}><Group justify="space-between"><Text>Labor:</Text><Text fw={600}>{formatCurrency(quoteData.totals.labor)}</Text></Group></Grid.Col>
              <Grid.Col span={6}><Group justify="space-between"><Text>Materials:</Text><Text fw={600}>{formatCurrency(quoteData.totals.materials)}</Text></Group></Grid.Col>
              <Grid.Col span={6}><Group justify="space-between"><Text>Other Costs:</Text><Text fw={600}>{formatCurrency(quoteData.totals.other)}</Text></Group></Grid.Col>
              <Grid.Col span={6}><Group justify="space-between"><Text>Per Diem:</Text><Text fw={600}>{formatCurrency(quoteData.totals.perDiem)}</Text></Group></Grid.Col>
            </Grid>
            <Divider />
            <Group justify="space-between">
              <Text size="lg" fw={700}>Grand Total:</Text>
              <Text size="lg" fw={700} c="blue">{formatCurrency(quoteData.totals.grandTotal)}</Text>
            </Group>
          </Stack>
        </Card>
      </Stack>
    );
  };
  
  // --- READ-ONLY TAB RENDERERS ---
  // const renderLaborTab = () => { return <Text>Labor tab content is not yet implemented.</Text>; };
  const renderLaborTab = () => {
  if (!quoteData?.laborItems || quoteData.laborItems.length === 0) {
    return <Text>No labor items found.</Text>;
  }

  return (
    <Table striped highlightOnHover withColumnBorders>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Description</Table.Th>
          <Table.Th>Discipline</Table.Th>
          <Table.Th>Total Hours</Table.Th>
          <Table.Th>Bill Rate</Table.Th>
          <Table.Th>Total Billable</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {quoteData.laborItems.map((item) => (
          <Table.Tr key={item.Id}>
            <Table.Td>{item.Description}</Table.Td>
            <Table.Td>{item.DisciplineName}</Table.Td>
            <Table.Td>{item.TotalHours}</Table.Td>
            <Table.Td>{formatCurrency(item.BillRate)}</Table.Td>
            <Table.Td>{formatCurrency(item.LaborTotalBillable || item.TotalBillable)}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};
  // const renderMaterialsTab = () => { return <Text>Material tab content is not yet implemented.</Text>; };
  const renderMaterialsTab = () => {
  if (!quoteData?.materialItems || quoteData.materialItems.length === 0) {
    return <Text>No materials found.</Text>;
  }

  return (
    <Table striped highlightOnHover withColumnBorders>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Description</Table.Th>
          <Table.Th>Discipline</Table.Th>
          <Table.Th>Cost</Table.Th>
          <Table.Th>Billable</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {quoteData.materialItems.map((item) => (
          <Table.Tr key={item.Id}>
            <Table.Td>{item.Description}</Table.Td>
            <Table.Td>{item.DisciplineName}</Table.Td>
            <Table.Td>{formatCurrency(item.Cost)}</Table.Td>
            <Table.Td>{formatCurrency(item.Billable)}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};
  // const renderOtherTab = () => { return <Text>Other tab content is not yet implemented.</Text>; };
  const renderOtherTab = () => {
  if (!quoteData?.otherItems || quoteData.otherItems.length === 0) {
    return <Text>No other costs found.</Text>;
  }

  return (
    <Table striped highlightOnHover withColumnBorders>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Description</Table.Th>
          <Table.Th>Type</Table.Th>
          <Table.Th>Discipline</Table.Th>
          <Table.Th>Cost</Table.Th>
          <Table.Th>Billable</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {quoteData.otherItems.map((item) => (
          <Table.Tr key={item.Id}>
            <Table.Td>{item.Description}</Table.Td>
            <Table.Td>{item.OtherTypeName}</Table.Td>
            <Table.Td>{item.DisciplineName}</Table.Td>
            <Table.Td>{formatCurrency(item.Cost)}</Table.Td>
            <Table.Td>{formatCurrency(item.Billable)}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};
  // const renderPerDiemTab = () => { return <Text>PerDiem tab content is not yet implemented.</Text>; };
  const renderPerDiemTab = () => {
  if (!quoteData?.perDiemItems || quoteData.perDiemItems.length === 0) {
    return <Text>No per diem entries found.</Text>;
  }

  return (
    <Table striped highlightOnHover withColumnBorders>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Discipline</Table.Th>
          <Table.Th>Employees</Table.Th>
          <Table.Th>Days</Table.Th>
          <Table.Th>Pay Rate</Table.Th>
          <Table.Th>Bill Rate</Table.Th>
          <Table.Th>Bill Total</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {quoteData.perDiemItems.map((item) => (
          <Table.Tr key={item.ID}>
            <Table.Td>{item.DisciplineName}</Table.Td>
            <Table.Td>{item.NumOfEmployees}</Table.Td>
            <Table.Td>{item.NumOfDays}</Table.Td>
            <Table.Td>{formatCurrency(item.PerDiemPayRate)}</Table.Td>
            <Table.Td>{formatCurrency(item.PerDiemBillRate)}</Table.Td>
            <Table.Td>{formatCurrency(item.PerDiemBillTotal)}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        quoteData ? (
          <Group>
            <Text size="lg" fw={600}>{isEditing ? 'Editing:' : ''} {quoteData.quote.Name || `Quote ${quoteData.quote.ProposalNumber}`}</Text>
            <Badge variant="light">#{quoteData.quote.ProposalNumber}</Badge>
          </Group>
        ) : 'Quote Details'
      }
      size="65%"
    >
      <div style={{ position: 'relative', minHeight: '400px' }}>
        <LoadingOverlay visible={loading || saving} />
        {error && <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" mb="md">{error}</Alert>}
        {quoteData && (
          <>
            <Tabs defaultValue="summary">
              <Tabs.List>
                <Tabs.Tab value="summary">Summary</Tabs.Tab>
                {/* Other tabs can be disabled during edit mode if desired */}
                <Tabs.Tab value="labor" disabled={isEditing}>Labor</Tabs.Tab>
                <Tabs.Tab value="materials" disabled={isEditing}>Materials</Tabs.Tab>
                <Tabs.Tab value="other" disabled={isEditing}>Other</Tabs.Tab>
                <Tabs.Tab value="perdiem" disabled={isEditing}>Per Diem</Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value="summary" pt="md">{renderSummaryTab()}</Tabs.Panel>
              <Tabs.Panel value="labor" pt="md">{renderLaborTab()}</Tabs.Panel>
              <Tabs.Panel value="materials" pt="md">{renderMaterialsTab()}</Tabs.Panel>
              <Tabs.Panel value="other" pt="md">{renderOtherTab()}</Tabs.Panel>
              <Tabs.Panel value="perdiem" pt="md">{renderPerDiemTab()}</Tabs.Panel>
            </Tabs>
            {isEditing && (
                <Group justify="flex-end" mt="md">
                    <Button variant="default" onClick={onClose}>Cancel</Button>
                    <Button leftSection={<IconDeviceFloppy size={16} />} onClick={handleSaveChanges} loading={saving}>Save Changes</Button>
                </Group>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

export default QuoteDetails;