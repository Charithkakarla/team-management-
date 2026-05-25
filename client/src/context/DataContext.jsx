import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { fetchUsers, createUser as createUserRequest } from '../services/userService';
import { fetchTeams, createTeam as createTeamRequest } from '../services/teamService';
import { fetchRoles, createRole as createRoleRequest, updateRolePermissions as updateRolePermissionsRequest } from '../services/roleService';
import { addUserToTeam as addUserToTeamRequest, removeUserFromTeam as removeUserFromTeamRequest, assignRole as assignRoleRequest, updateRole as updateRoleRequest } from '../services/membershipService';

const DataContext = createContext(null);

const parseError = (error) => error?.response?.data?.message || error?.message || 'Something went wrong';

export const DataProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshDirectory = async () => {
    if (!isAuthenticated) {
      setUsers([]);
      setTeams([]);
      setRoles([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [usersResponse, teamsResponse, rolesResponse] = await Promise.all([
        fetchUsers(),
        fetchTeams(),
        fetchRoles()
      ]);

      setUsers(usersResponse.data || []);
      setTeams(teamsResponse.data || []);
      setRoles(rolesResponse.data || []);
    } catch (error) {
      toast.error(parseError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshDirectory();
  }, [isAuthenticated]);

  const refreshAfterMutation = async (message, mutation) => {
    try {
      const response = await mutation();
      toast.success(message);
      await refreshDirectory();
      return response.data;
    } catch (error) {
      toast.error(parseError(error));
      throw error;
    }
  };

  const value = useMemo(
    () => ({
      users,
      teams,
      roles,
      loading,
      refreshDirectory,
      createUser: (payload) => refreshAfterMutation('User created', () => createUserRequest(payload)),
      createTeam: (payload) => refreshAfterMutation('Team created', () => createTeamRequest(payload)),
      createRole: (payload) => refreshAfterMutation('Role created', () => createRoleRequest(payload)),
      updateRolePermissions: (roleId, permissions) => refreshAfterMutation('Permissions updated', () => updateRolePermissionsRequest(roleId, permissions)),
      addUserToTeam: (payload) => refreshAfterMutation('User added to team', () => addUserToTeamRequest(payload)),
      removeUserFromTeam: (payload) => refreshAfterMutation('Membership removed', () => removeUserFromTeamRequest(payload)),
      assignRole: (payload) => refreshAfterMutation('Role assigned', () => assignRoleRequest(payload)),
      updateRole: (payload) => refreshAfterMutation('Role updated', () => updateRoleRequest(payload))
    }),
    [users, teams, roles, loading, refreshDirectory]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used inside DataProvider');
  }
  return context;
};
