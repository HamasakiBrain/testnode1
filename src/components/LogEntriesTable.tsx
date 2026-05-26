'use client';

import { Button, Chip, Spinner, Table } from '@heroui/react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { LogEntry } from '@/types';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Props {
  entries: LogEntry[];
  isLoading: boolean;
  onEdit: (entry: LogEntry) => void;
  onDelete: (entry: LogEntry) => void;
}

export function LogEntriesTable({ entries, isLoading, onEdit, onDelete }: Props) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner color="accent" />
      </div>
    );
  }

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content
          aria-label="Журнал работ"
          className="min-w-[600px]"
        >
          <Table.Header>
            <Table.Column isRowHeader>Дата</Table.Column>
            <Table.Column>Вид работ</Table.Column>
            <Table.Column>Объём</Table.Column>
            <Table.Column>Исполнитель</Table.Column>
            <Table.Column className="w-28 text-center">Действия</Table.Column>
          </Table.Header>
          <Table.Body
            renderEmptyState={() => (
              <div className="flex items-center justify-center py-12 text-gray-500">
                Записей пока нет
              </div>
            )}
          >
            {entries.map((entry) => (
              <Table.Row key={entry.id} id={entry.id}>
                <Table.Cell>
                  {format(new Date(entry.date), 'dd.MM.yyyy', { locale: ru })}
                </Table.Cell>
                <Table.Cell className="font-medium">
                  {entry.workType.name}
                </Table.Cell>
                <Table.Cell>
                  <Chip size="sm" variant="soft" color="accent">
                    <Chip.Label>
                      {entry.volume} {entry.workType.unit}
                    </Chip.Label>
                  </Chip>
                </Table.Cell>
                <Table.Cell>{entry.workerName}</Table.Cell>
                <Table.Cell>
                  <div className="flex gap-1 justify-center">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="ghost"
                      onPress={() => onEdit(entry)}
                    >
                      <PencilIcon className="w-4 h-4 text-gray-600" />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="danger"
                      onPress={() => onDelete(entry)}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}
