'use client';

import { useState, useCallback } from 'react';
import {
  Button,
  Card,
  Label,
  ListBox,
  Select,
} from '@heroui/react';
import {
  PlusIcon,
  FunnelIcon,
  ArrowDownIcon,
  ArrowUpIcon,
} from '@heroicons/react/24/outline';
import { LogEntry, LogEntryFormData } from '@/types';
import {
  useLogEntries,
  useCreateLogEntry,
  useUpdateLogEntry,
  useDeleteLogEntry,
} from '@/hooks/useLogEntries';
import { LogEntriesTable } from '@/components/LogEntriesTable';
import { LogEntryForm } from '@/components/LogEntryForm';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { DatePickerField } from '@/components/DatePickerField';

export default function Home() {
  const [filters, setFilters] = useState({
    from: '',
    to: '',
    sort: 'desc' as 'asc' | 'desc',
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<LogEntry | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<LogEntry | null>(null);

  const { data: entries, isLoading } = useLogEntries(filters);
  const createMutation = useCreateLogEntry();
  const updateMutation = useUpdateLogEntry();
  const deleteMutation = useDeleteLogEntry();

  const handleCreate = useCallback(
    (data: LogEntryFormData) => {
      createMutation.mutate(data, {
        onSuccess: () => setIsFormOpen(false),
      });
    },
    [createMutation]
  );

  const handleUpdate = useCallback(
    (data: LogEntryFormData) => {
      if (!editingEntry) return;
      updateMutation.mutate(
        { id: editingEntry.id, data },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            setEditingEntry(null);
          },
        }
      );
    },
    [editingEntry, updateMutation]
  );

  const handleDelete = useCallback(() => {
    if (!deletingEntry) return;
    deleteMutation.mutate(deletingEntry.id, {
      onSuccess: () => setDeletingEntry(null),
    });
  }, [deletingEntry, deleteMutation]);

  const openCreate = () => {
    setEditingEntry(null);
    setIsFormOpen(true);
  };

  const openEdit = (entry: LogEntry) => {
    setEditingEntry(entry);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingEntry(null);
  };

  const formInitialData: LogEntryFormData | undefined = editingEntry
    ? {
        date: editingEntry.date.split('T')[0],
        workTypeId: String(editingEntry.workTypeId),
        volume: String(editingEntry.volume),
        workerName: editingEntry.workerName,
      }
    : undefined;

  return (
    <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Журнал работ</h1>
        <p className="text-gray-500 mt-1">
          Учёт выполненных работ на строительном объекте
        </p>
      </div>

      <Card className="mb-6">
        <Card.Header className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 text-gray-500" />
            <Card.Title>Фильтры</Card.Title>
          </div>
          <Button variant="primary" onPress={openCreate}>
            <PlusIcon className="w-5 h-5 mr-1.5" />
            Новая запись
          </Button>
        </Card.Header>
        <Card.Content>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex flex-col gap-1 sm:w-48 w-full">
              <DatePickerField
                label="С"
                value={filters.from}
                onChange={(value) =>
                  setFilters((f) => ({ ...f, from: value }))
                }
              />
            </div>
            <div className="flex flex-col gap-1 sm:w-48 w-full">
              <DatePickerField
                label="По"
                value={filters.to}
                onChange={(value) =>
                  setFilters((f) => ({ ...f, to: value }))
                }
              />
            </div>
            <div className="flex flex-col gap-1 sm:w-48 w-full">
              <Select
                value={filters.sort}
                onChange={(value) =>
                  setFilters((f) => ({
                    ...f,
                    sort: (value as string) as 'asc' | 'desc',
                  }))
                }
              >
                <Label>Сортировка</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    <ListBox.Item id="desc" textValue="Сначала новые">
                      {filters.sort === 'desc' ? (
                        <ArrowDownIcon className="w-4 h-4 mr-2 inline" />
                      ) : null}
                      Сначала новые
                    </ListBox.Item>
                    <ListBox.Item id="asc" textValue="Сначала старые">
                      {filters.sort === 'asc' ? (
                        <ArrowUpIcon className="w-4 h-4 mr-2 inline" />
                      ) : null}
                      Сначала старые
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>
            </div>
            <Button
              variant="ghost"
              onPress={() => setFilters({ from: '', to: '', sort: 'desc' })}
            >
              Сбросить
            </Button>
          </div>
        </Card.Content>
      </Card>

      <Card>
        <LogEntriesTable
          entries={entries || []}
          isLoading={isLoading}
          onEdit={openEdit}
          onDelete={setDeletingEntry}
        />
      </Card>

      <LogEntryForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={editingEntry ? handleUpdate : handleCreate}
        initialData={formInitialData}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteConfirmModal
        isOpen={!!deletingEntry}
        onClose={() => setDeletingEntry(null)}
        onConfirm={handleDelete}
        entry={deletingEntry}
        isLoading={deleteMutation.isPending}
      />
    </main>
  );
}
