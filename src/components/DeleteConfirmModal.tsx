'use client';

import { Button, Modal } from '@heroui/react';
import { LogEntry } from '@/types';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  entry: LogEntry | null;
  isLoading?: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  entry,
  isLoading,
}: Props) {
  if (!entry) return null;

  return (
    <Modal.Backdrop
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-md w-full">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>Удалить запись?</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <p className="text-gray-600">
              Вы уверены, что хотите удалить запись от{' '}
              <strong>
                {format(new Date(entry.date), 'dd.MM.yyyy', { locale: ru })}
              </strong>{' '}
              — <strong>{entry.workType.name}</strong> ({entry.volume}{' '}
              {entry.workType.unit}), исполнитель{' '}
              <strong>{entry.workerName}</strong>?
            </p>
          </Modal.Body>
          <Modal.Footer className="flex justify-end gap-2">
            <Button variant="ghost" onPress={onClose}>
              Отмена
            </Button>
            <Button
              variant="danger"
              onPress={onConfirm}
              isDisabled={!!isLoading}
            >
              Удалить
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
