import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Team } from '../models/Team.js';
import { Role } from '../models/Role.js';
import { Membership } from '../models/Membership.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/team-management';

const seed = async () => {
  console.log('Connecting to', MONGODB_URI);
  await mongoose.connect(MONGODB_URI);

  try {
    // Clean minimal collections
    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Role.deleteMany({}),
      Membership.deleteMany({})
    ]);

    // Create roles
    const adminRole = await Role.create({ name: 'Admin', permissions: ['CREATE_TASK','EDIT_TASK','DELETE_TASK','VIEW_ONLY','MANAGE_USERS'] });
    const viewerRole = await Role.create({ name: 'Viewer', permissions: ['VIEW_ONLY'] });

    // Create teams
    const alpha = await Team.create({ name: 'Alpha', description: 'Alpha team' });
    const beta = await Team.create({ name: 'Beta', description: 'Beta team' });

    // Create users
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'password123';
    const adminHash = await bcrypt.hash(adminPassword, 10);
    const alice = await User.create({ name: 'Alice Admin', email: 'alice@example.com', passwordHash: adminHash });

    const bob = await User.create({ name: 'Bob Viewer', email: 'bob@example.com' });

    // Memberships
    await Membership.create({ userId: alice._id, teamId: alpha._id, roleId: adminRole._id });
    await Membership.create({ userId: alice._id, teamId: beta._id, roleId: viewerRole._id });
    await Membership.create({ userId: bob._id, teamId: alpha._id, roleId: viewerRole._id });

    console.log('Seeding complete.');
    console.log('Admin credentials: email=alice@example.com password=', adminPassword);
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
