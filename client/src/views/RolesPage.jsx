// Roles page: manages role templates and their permissions.
// It is used by the CEO to define access levels.
// Use this file to understand role administration.
import { useMemo, useState } from 'react';
import { Plus, Pencil } from 'lucide-react';
import { Card, Button, Input, Modal, Table, Badge, EmptyState } from '../ui/core';
import { PERMISSIONS } from '../constants/permissions';
import { useData } from '../state/DataContext';

const defaultForm = { name: '', permissions: [] };

export const RolesPage = () => {
  const { roles, createRole, updateRolePermissions, loading } = useData();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [form, setForm] = useState(defaultForm);

  const filteredRoles = useMemo(
    () => roles.filter((role) => `${role.name} ${role.permissions.join(' ')}`.toLowerCase().includes(search.toLowerCase())),
    [roles, search]
  );

  const openCreate = () => {
    setEditingRole(null);
    setForm(defaultForm);
    setOpen(true);
  };

  const openEdit = (role) => {
    setEditingRole(role);
    setForm({ name: role.name, permissions: role.permissions || [] });
    setOpen(true);
  };

  const togglePermission = (permission) => {
    setForm((current) => ({
      ...current,
      permissions: current.permissions.includes(permission)
        ? current.permissions.filter((item) => item !== permission)
        : [...current.permissions, permission]
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (editingRole) {
      await updateRolePermissions(editingRole._id, form.permissions);
    } else {
      await createRole(form);
    }
    setOpen(false);
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-[13px] uppercase tracking-[0.24em] text-text-muted">Roles</div>
          <h2 className="mt-2 text-xl font-semibold text-text-primary">Define reusable permission sets</h2>
        </div>
        <div className="flex gap-3">
          <Input placeholder="Search roles" value={search} onChange={(event) => setSearch(event.target.value)} className="md:w-72" />
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            New Role
          </Button>
        </div>
      </div>

      <Card className="p-0">
        <Table
          loading={loading}
          columns={[
            { key: 'name', label: 'Role' },
            { key: 'permissions', label: 'Permissions' },
            { key: 'actions', label: 'Actions' }
          ]}
          data={filteredRoles}
          emptyState={<EmptyState title="No roles yet" description="Create roles to map users to permissions across teams." />}
          renderRow={(role) => (
            <tr key={role._id} className="transition hover:bg-black/5 dark:hover:bg-white/5">
              <td className="px-4 py-4 text-sm font-medium text-text-primary">{role.name}</td>
              <td className="px-4 py-4 text-sm text-text-muted">
                <div className="flex flex-wrap gap-2">
                  {(role.permissions || []).map((permission) => (
                    <Badge key={permission} tone="primary">{permission}</Badge>
                  ))}
                </div>
              </td>
              <td className="px-4 py-4">
                <Button variant="secondary" size="sm" onClick={() => openEdit(role)}>
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              </td>
            </tr>
          )}
        />
      </Card>

      <Modal
        open={open}
        title={editingRole ? 'Edit role permissions' : 'Create role'}
        description="Select the permissions that belong to this role."
        onClose={() => setOpen(false)}
        className="max-w-3xl"
        footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={submit}>{editingRole ? 'Save Changes' : 'Create Role'}</Button></>}
      >
        <form className="grid gap-4" onSubmit={submit}>
          {!editingRole ? <Input label="Role name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required /> : null}
          <div className="grid gap-3 md:grid-cols-2">
            {PERMISSIONS.map((permission) => (
              <label key={permission} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-gray-50 px-4 py-3 transition hover:bg-blue-50 dark:bg-white/5 dark:hover:bg-white/10">
                <input type="checkbox" checked={form.permissions.includes(permission)} onChange={() => togglePermission(permission)} className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
                <span className="text-sm font-medium text-text-primary">{permission}</span>
              </label>
            ))}
          </div>
        </form>
      </Modal>
    </div>
  );
};
