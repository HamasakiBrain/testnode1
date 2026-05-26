'use client';

import { DatePicker, DateField, Calendar, Label, FieldError } from '@heroui/react';
import { parseDate, CalendarDate } from '@internationalized/date';

interface DatePickerFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  'aria-label'?: string;
  isDisabled?: boolean;
  isInvalid?: boolean;
  errorMessage?: string;
}

function strToDate(str: string): CalendarDate | null {
  if (!str) return null;
  try {
    return parseDate(str);
  } catch {
    return null;
  }
}

export function DatePickerField({
  label,
  value,
  onChange,
  errorMessage,
  ...props
}: DatePickerFieldProps) {
  return (
    <DatePicker
      value={strToDate(value)}
      onChange={(v) => onChange((v as CalendarDate | null)?.toString() ?? '')}
      {...props}
    >
      {label && <Label>{label}</Label>}
      <DateField.Group fullWidth>
        <DateField.Input>
          {(segment) => <DateField.Segment segment={segment} />}
        </DateField.Input>
        <DateField.Suffix>
          <DatePicker.Trigger>
            <DatePicker.TriggerIndicator />
          </DatePicker.Trigger>
        </DateField.Suffix>
      </DateField.Group>
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
      <DatePicker.Popover>
        <Calendar aria-label={props['aria-label'] || label || 'Дата'}>
          <Calendar.Header>
            <Calendar.YearPickerTrigger>
              <Calendar.YearPickerTriggerHeading />
              <Calendar.YearPickerTriggerIndicator />
            </Calendar.YearPickerTrigger>
            <Calendar.NavButton slot="previous" />
            <Calendar.NavButton slot="next" />
          </Calendar.Header>
          <Calendar.Grid>
            <Calendar.GridHeader>
              {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
            </Calendar.GridHeader>
            <Calendar.GridBody>
              {(date) => <Calendar.Cell date={date} />}
            </Calendar.GridBody>
          </Calendar.Grid>
          <Calendar.YearPickerGrid>
            <Calendar.YearPickerGridBody>
              {({ year }) => <Calendar.YearPickerCell year={year} />}
            </Calendar.YearPickerGridBody>
          </Calendar.YearPickerGrid>
        </Calendar>
      </DatePicker.Popover>
    </DatePicker>
  );
}
