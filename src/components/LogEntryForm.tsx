'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Button,
  Modal,
  Label,
  TextField,
  Input,
  Select,
  ListBox,
  FieldError,
} from '@heroui/react';
import { LogEntryFormData } from '@/types';
import { useWorkTypes } from '@/hooks/useWorkTypes';
import { DatePickerField } from './DatePickerField';

const schema = z.object({
  date: z.string().min(1, 'Дата обязательна'),
  workTypeId: z.string().min(1, 'Выберите вид работ'),
  volume: z.string().min(1, 'Объём обязателен'),
  workerName: z.string().min(1, 'ФИО исполнителя обязательно'),
});

type FormData = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LogEntryFormData) => void;
  initialData?: LogEntryFormData;
  isLoading?: boolean;
}

export function LogEntryForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: Props) {
  const { data: workTypes, isLoading: workTypesLoading } = useWorkTypes();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      date: new Date().toISOString().split('T')[0],
      workTypeId: '',
      volume: '',
      workerName: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        date: new Date().toISOString().split('T')[0],
        workTypeId: '',
        volume: '',
        workerName: '',
      });
    }
  }, [initialData, isOpen, reset]);

  const handleFormSubmit = (data: FormData) => {
    onSubmit(data);
  };

  return (
    <Modal.Backdrop
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-lg w-full">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Heading>
              {initialData ? 'Редактировать запись' : 'Новая запись'}
            </Modal.Heading>
          </Modal.Header>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Modal.Body className="space-y-4">
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <DatePickerField
                    label="Дата выполнения"
                    value={field.value}
                    onChange={field.onChange}
                    isInvalid={!!errors.date}
                    errorMessage={errors.date?.message}
                  />
                )}
              />

              <Controller
                name="workTypeId"
                control={control}
                render={({ field: { value, onChange, ...field } }) => (
                  <Select
                    className="w-full"
                    isInvalid={!!errors.workTypeId}
                    value={value || null}
                    onChange={(v) => onChange(v ?? '')}
                    isDisabled={workTypesLoading}
                    placeholder="Выберите вид работ"
                    {...field}
                  >
                    <Label>Вид работ</Label>
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {(workTypes || []).map((wt) => (
                          <ListBox.Item
                            key={wt.id}
                            id={String(wt.id)}
                            textValue={`${wt.name} (${wt.unit})`}
                          >
                            {wt.name} ({wt.unit})
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                    <FieldError>{errors.workTypeId?.message}</FieldError>
                  </Select>
                )}
              />

              <Controller
                name="volume"
                control={control}
                render={({ field }) => (
                  <TextField
                    className="w-full"
                    isInvalid={!!errors.volume}
                  >
                    <Label>Объём</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Введите объём"
                      {...field}
                    />
                    <FieldError>{errors.volume?.message}</FieldError>
                  </TextField>
                )}
              />

              <Controller
                name="workerName"
                control={control}
                render={({ field }) => (
                  <TextField
                    className="w-full"
                    isInvalid={!!errors.workerName}
                  >
                    <Label>ФИО исполнителя</Label>
                    <Input placeholder="Иванов И.И." {...field} />
                    <FieldError>{errors.workerName?.message}</FieldError>
                  </TextField>
                )}
              />
            </Modal.Body>
            <Modal.Footer className="flex justify-end gap-2">
              <Button variant="ghost" onPress={onClose} type="button">
                Отмена
              </Button>
              <Button
                variant="primary"
                type="submit"
                isDisabled={!!isLoading}
              >
                {initialData ? 'Сохранить' : 'Добавить'}
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
