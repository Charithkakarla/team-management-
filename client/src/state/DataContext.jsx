// Data state: loads and mutates users, teams, roles, and tasks.
// It refreshes shared data after each create or update action.
// Use this file to see how dashboard data is fetched.
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { fetchUsers, createUser as createUserRequest } from '../api/userService';
import { fetchTeams, createTeam as createTeamRequest } from '../api/teamService';
import { fetchRoles, createRole as createRoleRequest, updateRolePermissions as updateRolePermissionsRequest } from '../api/roleService';
import { addUserToTeam as addUserToTeamRequest, removeUserFromTeam as removeUserFromTeamRequest, assignRole as assignRoleRequest, updateRole as updateRoleRequest } from '../api/membershipService';
import { fetchTasks, createTask as createTaskRequest, updateTask as updateTaskRequest, completeTask as completeTaskRequest, undoTask as undoTaskRequest, deleteTask as deleteTaskRequest } from '../api/taskService';

const DataContext = createContext(null);

const parseError = (error) => error?.response?.data?.message || error?.message || 'Something went wrong';

export const DataProvider = ({ children }) => {
  const { isAuthenticated, refreshUser } = useAuth();
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [roles, setRoles] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const refreshDirectory = async () => {
    if (!isAuthenticated) {
      setUsers([]);
      setTeams([]);
      setRoles([]);
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [usersResponse, teamsResponse, tasksResponse, rolesResponse] = await Promise.allSettled([
        fetchUsers(),
        fetchTeams(),
        fetchTasks(),
        user?.isAdmin || user?.isManager ? fetchRoles() : Promise.resolve({ data: [] })
      ]);

      setUsers(usersResponse.status === 'fulfilled' ? usersResponse.value.data || [] : []);
      setTeams(teamsResponse.status === 'fulfilled' ? teamsResponse.value.data || [] : []);
      setTasks(tasksResponse.status === 'fulfilled' ? tasksResponse.value.data || [] : []);
      setRoles((user?.isAdmin || user?.isManager) && rolesResponse.status === 'fulfilled' ? rolesResponse.value.data || [] : []);
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
      tasks,
      loading,
      refreshDirectory,
      createUser: (payload) => refreshAfterMutation('User created', () => createUserRequest(payload)),
      createTeam: (payload) => refreshAfterMutation('Team created', () => createTeamRequest(payload)),
      createRole: (payload) => refreshAfterMutation('Role created', () => createRoleRequest(payload)),
      updateRolePermissions: (roleId, permissions) => refreshAfterMutation('Permissions updated', () => updateRolePermissionsRequest(roleId, permissions)),
      addUserToTeam: (payload) => refreshAfterMutation('User added to team', () => addUserToTeamRequest(payload)),
      removeUserFromTeam: (payload) => refreshAfterMutation('Membership removed', () => removeUserFromTeamRequest(payload)),
      assignRole: async (payload) => {
        try {
          const res = await assignRoleRequest(payload);
          toast.success('Role assigned');
          await refreshDirectory();
          // If the role change affected the currently logged-in user, refresh their profile
          if (res?.data?.userId?._id && user?.id && res.data.userId._id === user.id && refreshUser) {
            await refreshUser();
          }
          return res.data;
        } catch (error) {
          toast.error(parseError(error));
          throw error;
        }
      },
      updateRole: (payload) => refreshAfterMutation('Role updated', () => updateRoleRequest(payload)),
      createTask: (payload) => refreshAfterMutation('Task created', () => createTaskRequest(payload)),
      updateTask: (id, payload) => refreshAfterMutation('Task updated', () => updateTaskRequest(id, payload)),
      completeTask: (id) => refreshAfterMutation('Task completed', () => completeTaskRequest(id)),
      undoTask: (id) => refreshAfterMutation('Task reopened', () => undoTaskRequest(id)),
      deleteTask: (id) => refreshAfterMutation('Task deleted', () => deleteTaskRequest(id))
    }),
    [users, teams, roles, tasks, loading, refreshDirectory, user]
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
