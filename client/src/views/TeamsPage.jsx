// Teams page: manages teams and shows the members inside each team.
// It lets managers and the CEO inspect and maintain team membership.
// Use this file to understand team management.
import { useEffect, useMemo, useState } from 'react';
import { Plus, Users, Trash2 } from 'lucide-react';
import { Card, Button, Input, Textarea, Modal, Table, EmptyState, Badge } from '../ui/core';
import { useData } from '../hooks/useData';
import { fetchTeamMembers, removeUserFromTeam } from '../api/membershipService';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

export const TeamsPage = () => {
  const { teams, createTeam, loading } = useData();
  const { user } = useAuth();
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);

  const filteredTeams = useMemo(
    () => teams.filter((team) => `${team.name} ${team.description || ''}`.toLowerCase().includes(search.toLowerCase())),
    [teams, search]
  );

  const selectedTeam = useMemo(
    () => teams.find((team) => team._id === selectedTeamId),
    [teams, selectedTeamId]
  );

  const loadMembers = async () => {
    if (!selectedTeamId) {
      setTeamMembers([]);
      return;
    }

    setMembersLoading(true);
    try {
      const response = await fetchTeamMembers(selectedTeamId);
      setTeamMembers(response.data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to load team members');
    } finally {
      setMembersLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [selectedTeamId]);

  const submit = async (event) => {
    event.preventDefault();
    await createTeam(form);
    setForm({ name: '', description: '' });
    setOpen(false);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="grid gap-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 shadow-soft md:p-5">
          <div>
            <div className="text-[13px] uppercase tracking-[0.24em] text-text-muted">Teams</div>
            <h2 className="mt-2 text-xl font-semibold text-text-primary">Organize collaboration spaces</h2>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <Input
              placeholder="Search teams"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full lg:max-w-md"
            />
            <Button onClick={() => setOpen(true)} className="w-full lg:w-auto lg:px-5">
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
              <tr
                key={team._id}
                className="cursor-pointer transition hover:bg-black/5 dark:hover:bg-white/5"
                onClick={() => setSelectedTeamId(team._id)}
              >
                <td className="px-4 py-4 text-sm font-medium text-text-primary">{team.name}</td>
                <td className="px-4 py-4 text-sm text-text-muted">{team.description || 'No description'}</td>
                <td className="px-4 py-4 text-sm text-text-muted">{new Date(team.createdAt).toLocaleString()}</td>
              </tr>
            )}
          />
        </Card>
      </div>

      <Card>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <div>
            <div className="text-[13px] uppercase tracking-[0.24em] text-text-muted">Team members</div>
            <h3 className="mt-1 text-lg font-semibold text-text-primary">{selectedTeam?.name || 'Select a team'}</h3>
          </div>
        </div>
        <div className="mt-4 rounded-2xl border border-border bg-gray-50 p-4 text-sm text-text-muted dark:bg-white/5">
          {selectedTeam ? selectedTeam.description || 'No description' : 'Click a team to see its members.'}
        </div>

        <div className="mt-4 grid gap-3">
          {membersLoading ? (
            <div className="grid gap-3">
              <div className="h-12 animate-pulse rounded-2xl bg-gray-100 dark:bg-white/5" />
              <div className="h-12 animate-pulse rounded-2xl bg-gray-100 dark:bg-white/5" />
            </div>
          ) : teamMembers.length ? (
            teamMembers.map((membership) => (
              <div key={membership._id} className="rounded-2xl border border-border bg-surface p-4 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-text-primary">{membership.userId?.name}</div>
                    <div className="mt-1 text-xs text-text-muted">{membership.userId?.email}</div>
                  </div>
                  <Badge tone="muted">{membership.roleId?.name || 'No role'}</Badge>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 text-xs text-text-muted">
                  <span>Member since {new Date(membership.createdAt).toLocaleDateString()}</span>
                  {(user?.isAdmin || user?.isManager) ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-9 w-9 p-0"
                      title="Remove member"
                      aria-label="Remove member"
                      onClick={async () => {
                        await removeUserFromTeam({ userId: membership.userId?._id, teamId: selectedTeamId });
                        toast.success('Member removed from team');
                        await loadMembers();
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  ) : null}
                </div>
              </div>
            ))
          ) : (
            <EmptyState title="No members in this team" description="Select a team to view its members." />
          )}
        </div>
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
