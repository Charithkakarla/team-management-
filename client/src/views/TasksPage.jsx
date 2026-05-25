// Tasks page: creates, edits, completes, and deletes tasks.
// It is the main work area for task management.
// Use this file to understand task workflows.
import { useMemo, useState } from 'react';
import { CheckCircle2, Circle, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { Card, Button, Input, Textarea, Select, Table, Badge, EmptyState, Modal } from '../ui/core';
import { useData } from '../state/DataContext';
import { useAuth } from '../hooks/useAuth';

export const TasksPage = () => {
  const { tasks, users, teams, createTask, completeTask, undoTask, deleteTask, updateTask, loading } = useData();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', teamId: '', assigneeId: '', dueDate: '' });

  const sortedTasks = useMemo(() => tasks.slice(), [tasks]);

  const openCreate = () => {
    setEditingTask(null);
    setForm({ title: '', description: '', teamId: '', assigneeId: '', dueDate: '' });
    setOpen(true);
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setForm({
      title: task.title || '',
      description: task.description || '',
      teamId: task.teamId?._id || task.teamId || '',
      assigneeId: task.assigneeId?._id || task.assigneeId || '',
      dueDate: task.dueDate ? String(task.dueDate).slice(0, 10) : ''
    });
    setOpen(true);
  };

  const submit = async (event) => {
    event.preventDefault();

    const payload = {
      title: form.title,
      description: form.description,
      teamId: form.teamId || null,
      assigneeId: form.assigneeId || null,
      dueDate: form.dueDate || null
    };

    if (editingTask) {
      await updateTask(editingTask._id, payload);
    } else {
      await createTask(payload);
    }

    setOpen(false);
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-[13px] uppercase tracking-[0.24em] text-text-muted">Tasks</div>
          <h2 className="mt-2 text-xl font-semibold text-text-primary">Work assigned across teams</h2>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </div>

      <Card className="p-0">
        <Table
          loading={loading}
          columns={[
            { key: 'title', label: 'Task' },
            { key: 'team', label: 'Team' },
            { key: 'assignee', label: 'Assignee' },
            { key: 'status', label: 'Status' },
            { key: 'actions', label: 'Actions' }
          ]}
          data={sortedTasks}
          emptyState={<EmptyState title="No tasks yet" description="Create a task to track work for the CEO or employees." actionLabel="New Task" onAction={openCreate} />}
          renderRow={(task) => (
            <tr key={task._id} className="transition hover:bg-blue-50 dark:hover:bg-white/5">
              <td className="px-4 py-4">
                <div className="text-sm font-medium text-text-primary">{task.title}</div>
                <div className="mt-1 text-sm text-text-muted">{task.description || 'No description'}</div>
              </td>
              <td className="px-4 py-4 text-sm text-text-muted">{task.teamId?.name || 'No team'}</td>
              <td className="px-4 py-4 text-sm text-text-muted">{task.assigneeId?.name || 'Unassigned'}</td>
              <td className="px-4 py-4 text-sm">
                <Badge tone={task.status === 'done' ? 'success' : 'primary'}>{task.status}</Badge>
              </td>
              <td className="px-4 py-4">
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" size="sm" onClick={() => (task.status === 'done' ? undoTask(task._id) : completeTask(task._id))}>
                    {task.status === 'done' ? <RotateCcw className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                    {task.status === 'done' ? 'Undo' : 'Complete'}
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => openEdit(task)}>
                    <Circle className="h-4 w-4" />
                    Edit
                  </Button>
                  {(user?.isAdmin || task.createdById?._id === user?.id) ? (
                    <Button variant="destructive" size="sm" onClick={() => deleteTask(task._id)}>
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  ) : null}
                </div>
              </td>
            </tr>
          )}
        />
      </Card>

      <Modal
        open={open}
        title={editingTask ? 'Edit task' : 'Create task'}
        description="Track work and assign it to a team member."
        onClose={() => setOpen(false)}
        footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={submit}>{editingTask ? 'Save' : 'Create'}</Button></>}
      >
        <form className="grid gap-4" onSubmit={submit}>
          <Input label="Task title" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} required />
          <Textarea label="Description" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
          <div className="grid gap-4 md:grid-cols-3">
            <Select label="Team" value={form.teamId} onChange={(event) => setForm((current) => ({ ...current, teamId: event.target.value }))}>
              <option value="">Choose a team</option>
              {teams.map((team) => <option key={team._id} value={team._id}>{team.name}</option>)}
            </Select>
            <Select label="Assignee" value={form.assigneeId} onChange={(event) => setForm((current) => ({ ...current, assigneeId: event.target.value }))}>
              <option value="">Choose a member</option>
              {users.map((member) => <option key={member._id} value={member._id}>{member.name} - {member.email}</option>)}
            </Select>
            <Input label="Due date" type="date" value={form.dueDate} onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))} />
          </div>
        </form>
      </Modal>
    </div>
  );
};
