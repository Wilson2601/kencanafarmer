import { useState } from "react";
import { Dashboard } from "./Dashboard";
import { Reminders } from "./Reminders";

export interface Reminder {
  id: number;
  title: string;
  crop: string;
  time: string;
  type: 'water' | 'prune' | 'fertilize' | 'other';
  completed: boolean;
}

export default function DashboardPage() {
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: 1, title: 'Water Apple Trees', crop: 'Section A', time: '09:00', type: 'water', completed: false },
    { id: 2, title: 'Prune Orange Trees', crop: 'Section B', time: '14:00', type: 'prune', completed: false },
    { id: 3, title: 'Fertilize Mangoes', crop: 'Section C', time: '16:00', type: 'fertilize', completed: true },
  ]);

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4">
      <Dashboard reminders={reminders} setReminders={setReminders} />
      <Reminders reminders={reminders} setReminders={setReminders} />
    </div>
  );
}
