// Seed script: resets the database and loads demo users, teams, roles, and tasks.
// It creates the demo data used for testing and interviews.
// Use this file to understand how the sample data is built.
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config({
  path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '.env'),
  override: true
});

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../dataModels/User.js';
import { Team } from '../dataModels/Team.js';
import { Role } from '../dataModels/Role.js';
import { Membership } from '../dataModels/Membership.js';
import { getAdminEmail, getManagerEmail } from '../shared/access.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/team-management';
const ADMIN_EMAIL = getAdminEmail();
const MANAGER_EMAIL = getManagerEmail();
const ADMIN_NAME = process.env.ADMIN_NAME || 'CEO Admin';
const MANAGER_NAME = process.env.MANAGER_NAME || 'Operations Manager';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.SEED_ADMIN_PASSWORD || 'password123';
const MANAGER_PASSWORD = process.env.MANAGER_PASSWORD || 'Charith@2455';

const seed = async () => {
  console.log('Connecting to', MONGODB_URI);
  await mongoose.connect(MONGODB_URI);

  try {
    // Clean minimal collections
    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Role.deleteMany({}),
      Membership.deleteMany({}),
      mongoose.connection.collection('tasks').deleteMany({})
    ]);

    // Create roles
    const superAdminRole = await Role.create({ name: 'SuperAdmin', permissions: ['CREATE_TASK', 'EDIT_TASK', 'DELETE_TASK', 'VIEW_ONLY', 'MANAGE_USERS'] });
    const adminRole = await Role.create({ name: 'Admin', permissions: ['CREATE_TASK', 'EDIT_TASK', 'DELETE_TASK', 'VIEW_ONLY', 'MANAGE_USERS'] });
    const managerRole = await Role.create({ name: 'Manager', permissions: ['CREATE_TASK', 'EDIT_TASK', 'DELETE_TASK', 'VIEW_ONLY'] });
    const viewerRole = await Role.create({ name: 'Viewer', permissions: ['VIEW_ONLY'] });

    // Create core users for testing
    const adminHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const managerHash = await bcrypt.hash(MANAGER_PASSWORD, 10);
    const aliceHash = await bcrypt.hash('Alice@123', 10);
    const bobHash = await bcrypt.hash('Bob@123', 10);

    const adminUser = await User.create({ name: ADMIN_NAME, email: ADMIN_EMAIL, passwordHash: adminHash });
    const managerUser = await User.create({ name: MANAGER_NAME, email: MANAGER_EMAIL, passwordHash: managerHash });
    const employeeOne = await User.create({ name: 'Alice Employee', email: 'alice.employee@example.com', passwordHash: aliceHash });
    const employeeTwo = await User.create({ name: 'Bob Employee', email: 'bob.employee@example.com', passwordHash: bobHash });
    const testMailHash = await bcrypt.hash('TestMail@123', 10);
    const testMailUser = await User.create({ name: 'Test Mail', email: 'testmail@gmail.com', passwordHash: testMailHash });

    // Create starter teams
    const executiveTeam = await Team.create({ name: 'Executive', description: 'Leadership workspace' });
    const productTeam = await Team.create({ name: 'Product', description: 'Build and delivery' });
    const operationsTeam = await Team.create({ name: 'Operations', description: 'Support and coordination' });
    const qaTeam = await Team.create({ name: 'Quality Assurance', description: 'Static team for access checks' });

    // Assign memberships and roles
    await Membership.create({ userId: adminUser._id, teamId: executiveTeam._id, roleId: superAdminRole._id });
    await Membership.create({ userId: adminUser._id, teamId: productTeam._id, roleId: superAdminRole._id });
    await Membership.create({ userId: managerUser._id, teamId: productTeam._id, roleId: managerRole._id });
    await Membership.create({ userId: managerUser._id, teamId: operationsTeam._id, roleId: managerRole._id });
    await Membership.create({ userId: employeeOne._id, teamId: productTeam._id, roleId: viewerRole._id });
    await Membership.create({ userId: employeeTwo._id, teamId: operationsTeam._id, roleId: viewerRole._id });
    await Membership.create({ userId: testMailUser._id, teamId: qaTeam._id, roleId: viewerRole._id });

    // Seed tasks for module testing
    await mongoose.connection.collection('tasks').insertMany([
      {
        title: 'Launch onboarding checklist',
        description: 'Verify all new hires can access the dashboard and tasks module.',
        teamId: productTeam._id,
        assigneeId: employeeOne._id,
        createdById: adminUser._id,
        status: 'todo',
        dueDate: new Date(Date.now() + 86400000),
        completedAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Review permissions screen',
        description: 'Confirm admin and manager can see all modules while viewers cannot.',
        teamId: executiveTeam._id,
        assigneeId: managerUser._id,
        createdById: adminUser._id,
        status: 'doing',
        dueDate: new Date(Date.now() + 172800000),
        completedAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Prepare team summary report',
        description: 'Static task for testing delete and complete actions.',
        teamId: operationsTeam._id,
        assigneeId: employeeTwo._id,
        createdById: managerUser._id,
        status: 'done',
        dueDate: new Date(Date.now() - 86400000),
        completedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Audit QA access',
        description: 'Change testmail@gmail.com from Viewer to Manager and refresh the session.',
        teamId: qaTeam._id,
        assigneeId: testMailUser._id,
        createdById: adminUser._id,
        status: 'todo',
        dueDate: new Date(Date.now() + 259200000),
        completedAt: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    console.log('Seeding complete.');
    console.log(`Admin credentials: email=${ADMIN_EMAIL} password=${ADMIN_PASSWORD}`);
    console.log(`Manager credentials: email=${MANAGER_EMAIL} password=${MANAGER_PASSWORD}`);
    console.log('Employee credentials: alice.employee@example.com / Alice@123');
    console.log('Employee credentials: bob.employee@example.com / Bob@123');
    console.log('Employee credentials: testmail@gmail.com / TestMail@123');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
