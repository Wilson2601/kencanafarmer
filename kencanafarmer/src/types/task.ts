export type TaskType = 'water' | 'prune' | 'fertilize' | 'other';

export interface Task {
  id: number;
  title: string;
  crop: string;
  time: string;
  type: TaskType;
  completed: boolean;
}
