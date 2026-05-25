import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { Table } from '../components/Table';
import { EmptyState } from '../components/EmptyState';
import { useData } from '../context/DataContext';
import { useToast } from '../hooks/useToast';

export const UsersPage = () => {
  const { users, createUser, loading } = useData();
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });

  const filteredUsers = useMemo(
    () => users.filter((user) => `${user.name} ${user.email}`.toLowerCase().includes(search.toLowerCase())),
    [users, search]
  );

  const submit = async (event) => {
    event.preventDefault();
    await createUser(form);
    toast.success('User created successfully');
    setForm({ name: '', email: '' });
    setOpen(false);
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-[13px] uppercase tracking-[0.24em] text-text-muted">Users</div>
          <h2 className="mt-2 text-xl font-semibold text-text-primary">Manage user directory</h2>
        </div>
        <div className="flex gap-3">
          <Input placeholder="Search by name or email" value={search} onChange={(event) => setSearch(event.target.value)} className="md:w-80" />
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" />
            New User
          </Button>
        </div>
      </div>

      <Card className="p-0">
        <Table
          loading={loading}
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'createdAt', label: 'Created' }
          ]}
          data={filteredUsers}
          emptyState={<EmptyState title="No users yet" description="Create a user to start assigning team roles and permissions." />}
          renderRow={(user) => (
            <tr key={user._id} className="transition hover:bg-black/5 dark:hover:bg-white/5">
              <td className="px-4 py-4 text-sm font-medium text-text-primary">{user.name}</td>
              <td className="px-4 py-4 text-sm text-text-muted">{user.email}</td>
              <td className="px-4 py-4 text-sm text-text-muted">{new Date(user.createdAt).toLocaleString()}</td>
            </tr>
          )}
        />
      </Card>

      <Modal
        open={open}
        title="Create user"
        description="Add a new user record to the system."
        onClose={() => setOpen(false)}
        footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={submit}>Create</Button></>}
      >
        <form className="grid gap-4" onSubmit={submit}>
          <Input label="Name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required />
          <Input label="Email" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} required />
        </form>
      </Modal>
    </div>
  );
};
