import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Textarea } from '../components/Textarea';
import { Modal } from '../components/Modal';
import { Table } from '../components/Table';
import { EmptyState } from '../components/EmptyState';
import { useData } from '../context/DataContext';

export const TeamsPage = () => {
  const { teams, createTeam, loading } = useData();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });

  const filteredTeams = useMemo(
    () => teams.filter((team) => `${team.name} ${team.description || ''}`.toLowerCase().includes(search.toLowerCase())),
    [teams, search]
  );

  const submit = async (event) => {
    event.preventDefault();
    await createTeam(form);
    setForm({ name: '', description: '' });
    setOpen(false);
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-[13px] uppercase tracking-[0.24em] text-text-muted">Teams</div>
          <h2 className="mt-2 text-xl font-semibold text-text-primary">Organize collaboration spaces</h2>
        </div>
        <div className="flex gap-3">
          <Input placeholder="Search teams" value={search} onChange={(event) => setSearch(event.target.value)} className="md:w-72" />
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" />
            New Team
          </Button>
        </div>
      </div>

      <Card className="p-0">
        <Table
          loading={loading}
          columns={[
            { key: 'name', label: 'Team' },
            { key: 'description', label: 'Description' },
            { key: 'createdAt', label: 'Created' }
          ]}
          data={filteredTeams}
          emptyState={<EmptyState title="No teams yet" description="Create a team to start assigning roles and permissions." />}
          renderRow={(team) => (
            <tr key={team._id} className="transition hover:bg-black/5 dark:hover:bg-white/5">
              <td className="px-4 py-4 text-sm font-medium text-text-primary">{team.name}</td>
              <td className="px-4 py-4 text-sm text-text-muted">{team.description || 'No description'}</td>
              <td className="px-4 py-4 text-sm text-text-muted">{new Date(team.createdAt).toLocaleString()}</td>
            </tr>
          )}
        />
      </Card>

      <Modal
        open={open}
        title="Create team"
        description="Define a new team workspace."
        onClose={() => setOpen(false)}
        footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={submit}>Create</Button></>}
      >
        <form className="grid gap-4" onSubmit={submit}>
          <Input label="Team name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required />
          <Textarea label="Description" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
        </form>
      </Modal>
    </div>
  );
};
