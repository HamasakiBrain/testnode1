import { useQuery } from '@tanstack/react-query';
import { WorkType } from '@/types';

async function fetchWorkTypes(): Promise<WorkType[]> {
  const res = await fetch('/api/work-types');
  if (!res.ok) throw new Error('Failed to fetch work types');
  return res.json();
}

export function useWorkTypes() {
  return useQuery({
    queryKey: ['workTypes'],
    queryFn: fetchWorkTypes,
  });
}
