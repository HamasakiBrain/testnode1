export interface WorkType {
  id: number;
  name: string;
  unit: string;
}

export interface LogEntry {
  id: number;
  date: string;
  workTypeId: number;
  workType: WorkType;
  volume: number;
  workerName: string;
  createdAt: string;
  updatedAt: string;
}

export interface LogEntryFormData {
  date: string;
  workTypeId: string;
  volume: string;
  workerName: string;
}
