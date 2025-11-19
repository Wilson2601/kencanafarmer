import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Plus, Bell, Droplet, Scissors, Sprout, Trash2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface Reminder {
  id: number;
  title: string;
  crop: string;
  time: string;
  type: 'water' | 'prune' | 'fertilize' | 'other';
  completed: boolean;
}

export function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: 1,
      title: 'Water Apple Trees',
      crop: 'Section A',
      time: '9:00 AM',
      type: 'water',
      completed: false
    },
    {
      id: 2,
      title: 'Prune Orange Trees',
      crop: 'Section B',
      time: '11:00 AM',
      type: 'prune',
      completed: false
    },
    {
      id: 3,
      title: 'Fertilize Mangoes',
      crop: 'Section C',
      time: '3:00 PM',
      type: 'fertilize',
      completed: true
    }
  ]);

  const [open, setOpen] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    crop: '',
    time: '',
    type: 'other' as const
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'water':
        return <Droplet className="w-5 h-5 text-blue-600" />;
      case 'prune':
        return <Scissors className="w-5 h-5 text-purple-600" />;
      case 'fertilize':
        return <Sprout className="w-5 h-5 text-green-600" />;
      default:
        return <Bell className="w-5 h-5 text-orange-600" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'water':
        return 'bg-blue-100';
      case 'prune':
        return 'bg-purple-100';
      case 'fertilize':
        return 'bg-green-100';
      default:
        return 'bg-orange-100';
    }
  };

  const handleAddReminder = () => {
    if (newReminder.title && newReminder.crop && newReminder.time) {
      setReminders([...reminders, {
        id: reminders.length + 1,
        ...newReminder,
        completed: false
      }]);
      setNewReminder({ title: '', crop: '', time: '', type: 'other' });
      setOpen(false);
    }
  };

  const toggleComplete = (id: number) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, completed: !r.completed } : r
    ));
  };

  const deleteReminder = (id: number) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const activeReminders = reminders.filter(r => !r.completed);
  const completedReminders = reminders.filter(r => r.completed);

  return (
    <div className="p-4 pb-24 bg-green-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-green-800">Reminders</h1>
          <p className="text-green-600">{activeReminders.length} active tasks</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-green-600 hover:bg-green-700 rounded-full h-14 w-14 p-0">
              <Plus className="w-6 h-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[90%] rounded-lg">
            <DialogHeader>
              <DialogTitle>Add New Reminder</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="title">Task</Label>
                <Input
                  id="title"
                  placeholder="e.g., Water Apple Trees"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="type">Task Type</Label>
                <Select value={newReminder.type} onValueChange={(value: any) => setNewReminder({ ...newReminder, type: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select task type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="water">Water</SelectItem>
                    <SelectItem value="prune">Prune</SelectItem>
                    <SelectItem value="fertilize">Fertilize</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="crop">Location</Label>
                <Input
                  id="crop"
                  placeholder="e.g., Section A"
                  value={newReminder.crop}
                  onChange={(e) => setNewReminder({ ...newReminder, crop: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={newReminder.time}
                  onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                  className="mt-1"
                />
              </div>
              <Button onClick={handleAddReminder} className="w-full bg-green-600 hover:bg-green-700" size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Add Reminder
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Reminders */}
      {activeReminders.length > 0 && (
        <div className="mb-6">
          <h2 className="text-green-800 mb-3">Active</h2>
          <div className="space-y-3">
            {activeReminders.map((reminder) => (
              <Card key={reminder.id} className="p-4 bg-white">
                <div className="flex items-start gap-3">
                  <div className={`${getIconBg(reminder.type)} p-2 rounded-lg mt-1 flex-shrink-0`}>
                    {getIcon(reminder.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-green-900">{reminder.title}</p>
                    <p className="text-sm text-green-600">📍 {reminder.crop}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="bg-green-50 px-3 py-1 rounded-full">
                      <p className="text-sm text-green-700 whitespace-nowrap">{reminder.time}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleComplete(reminder.id)}
                        className="h-8 px-3"
                      >
                        ✓
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteReminder(reminder.id)}
                        className="h-8 px-2"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Completed Reminders */}
      {completedReminders.length > 0 && (
        <div>
          <h2 className="text-green-800 mb-3">Completed</h2>
          <div className="space-y-3">
            {completedReminders.map((reminder) => (
              <Card key={reminder.id} className="p-4 bg-white opacity-60">
                <div className="flex items-start gap-3">
                  <div className={`${getIconBg(reminder.type)} p-2 rounded-lg mt-1 flex-shrink-0`}>
                    {getIcon(reminder.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-green-900 line-through">{reminder.title}</p>
                    <p className="text-sm text-green-600">📍 {reminder.crop}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteReminder(reminder.id)}
                    className="h-8 px-2"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
