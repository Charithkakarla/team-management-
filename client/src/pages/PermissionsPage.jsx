import { useEffect, useMemo, useState } from 'react';
import { RefreshCw, Plus, Trash2, Shield } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Select } from '../components/Select';
import { Badge } from '../components/Badge';
import { EmptyState } from '../components/EmptyState';
import { useData } from '../context/DataContext';
import { fetchPermissions } from '../services/permissionService';
import { useToast } from '../hooks/useToast';

export const PermissionsPage = () => {
  const { users, teams, roles, addUserToTeam, removeUserFromTeam, assignRole } = useData();
  const toast = useToast();
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

  const selectedUser = useMemo(() => users.find((user) => user._id === selectedUserId), [users, selectedUserId]);
  const selectedTeam = useMemo(() => teams.find((team) => team._id === selectedTeamId), [teams, selectedTeamId]);
  const selectedRole = useMemo(() => roles.find((role) => role._id === selectedRoleId), [roles, selectedRoleId]);

  const loadPermissions = async () => {
    if (!selectedUserId || !selectedTeamId) {
      setPermissions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetchPermissions(selectedUserId, selectedTeamId);
      setPermissions(response.data.permissions || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to load permissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPermissions();
  }, [selectedUserId, selectedTeamId]);

  const handleJoinTeam = async () => {
    if (!selectedUserId || !selectedTeamId) {
      toast.error('Select a user and a team first');
      return;
    }

    await addUserToTeam({ userId: selectedUserId, teamId: selectedTeamId, roleId: selectedRoleId || null });
    await loadPermissions();
  };

  const handleAssignRole = async () => {
    if (!selectedUserId || !selectedTeamId || !selectedRoleId) {
      toast.error('Select a user, team, and role first');
      return;
    }

    await assignRole({ userId: selectedUserId, teamId: selectedTeamId, roleId: selectedRoleId });
    await loadPermissions();
  };

  const handleRemoveUser = async () => {
    if (!selectedUserId || !selectedTeamId) {
      toast.error('Select a user and a team first');
      return;
    }

    await removeUserFromTeam({ userId: selectedUserId, teamId: selectedTeamId });
    setPermissions([]);
  };

  return (
    <div className="grid gap-6">
      <div>
        <div className="text-[13px] uppercase tracking-[0.24em] text-text-muted">Permissions Viewer</div>
        <h2 className="mt-2 text-xl font-semibold text-text-primary">Resolve access by user and team</h2>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[13px] uppercase tracking-[0.24em] text-text-muted">Selection</div>
              <h3 className="mt-2 text-lg font-semibold text-text-primary">Pick a user and team</h3>
            </div>
            <Button variant="secondary" size="sm" onClick={loadPermissions}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Select label="User" value={selectedUserId} onChange={(event) => setSelectedUserId(event.target.value)}>
              <option value="">Choose a user</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>{user.name} - {user.email}</option>
              ))}
            </Select>

            <Select label="Team" value={selectedTeamId} onChange={(event) => setSelectedTeamId(event.target.value)}>
              <option value="">Choose a team</option>
              {teams.map((team) => (
                <option key={team._id} value={team._id}>{team.name}</option>
              ))}
            </Select>

            <Select label="Role" value={selectedRoleId} onChange={(event) => setSelectedRoleId(event.target.value)}>
              <option value="">Optional role</option>
              {roles.map((role) => (
                <option key={role._id} value={role._id}>{role.name}</option>
              ))}
            </Select>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={handleJoinTeam}>
              <Plus className="h-4 w-4" />
              Join Team
            </Button>
            <Button variant="secondary" onClick={handleAssignRole}>
              <Shield className="h-4 w-4" />
              Assign Role
            </Button>
            <Button variant="destructive" onClick={handleRemoveUser}>
              <Trash2 className="h-4 w-4" />
              Remove User
            </Button>
          </div>
        </Card>

        <Card>
          <div className="text-[13px] uppercase tracking-[0.24em] text-text-muted">Resolved access</div>
          <h3 className="mt-2 text-lg font-semibold text-text-primary">Permissions for the selected scope</h3>
          <div className="mt-4 rounded-2xl border border-border bg-gray-50 p-4 dark:bg-white/5">
            <div className="text-sm text-text-muted">User</div>
            <div className="mt-1 font-semibold text-text-primary">{selectedUser?.name || 'No user selected'}</div>
            <div className="mt-3 text-sm text-text-muted">Team</div>
            <div className="mt-1 font-semibold text-text-primary">{selectedTeam?.name || 'No team selected'}</div>
            <div className="mt-3 text-sm text-text-muted">Role</div>
            <div className="mt-1 font-semibold text-text-primary">{selectedRole?.name || 'No role selected'}</div>
          </div>

          <div className="mt-5">
            {loading ? (
              <div className="grid gap-3">
                <div className="h-12 animate-pulse rounded-2xl bg-gray-100 dark:bg-white/5" />
                <div className="h-12 animate-pulse rounded-2xl bg-gray-100 dark:bg-white/5" />
              </div>
            ) : permissions.length ? (
              <div className="flex flex-wrap gap-2">
                {permissions.map((permission) => (
                  <Badge key={permission} tone="success">{permission}</Badge>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No permissions resolved"
                description="Select a user and team that have a role mapping, or assign one using the controls above."
              />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
