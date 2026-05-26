import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LogEntry, LogEntryFormData } from '@/types';

interface Filters {
  from?: string;
  to?: string;
  sort?: 'asc' | 'desc';
}

async function fetchLogEntries(filters?: Filters): Promise<LogEntry[]> {
  const params = new URLSearchParams();
  if (filters?.from) params.set('from', filters.from);
  if (filters?.to) params.set('to', filters.to);
  if (filters?.sort) params.set('sort', filters.sort);

  const res = await fetch(`/api/log-entries?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch log entries');
  return res.json();
}

async function createLogEntry(data: LogEntryFormData): Promise<LogEntry> {
  const res = await fetch('/api/log-entries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.errors?.[0]?.message || 'Failed to create');
  }
  return res.json();
}

async function updateLogEntry({
  id,
  data,
}: {
  id: number;
  data: LogEntryFormData;
}): Promise<LogEntry> {
  const res = await fetch(`/api/log-entries/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.errors?.[0]?.message || 'Failed to update');
  }
  return res.json();
}

async function deleteLogEntry(id: number): Promise<void> {
  const res = await fetch(`/api/log-entries/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete');
}

export function useLogEntries(filters?: Filters) {
  return useQuery({
    queryKey: ['logEntries', filters],
    queryFn: () => fetchLogEntries(filters),
  });
}

export function useCreateLogEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLogEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logEntries'] });
    },
  });
}

export function useUpdateLogEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateLogEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logEntries'] });
    },
  });
}

export function useDeleteLogEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLogEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['logEntries'] });
    },
  });
}
