// Tasks feature: task CRUD and task-specific lifecycle actions.
// Tasks feature: task CRUD and task-specific lifecycle actions.
// It keeps all task operations and routes together.
// Use this file to understand task handling.
import { Router } from "express";
import { Task } from "../dataModels/Task.js";
import { AppError } from "../shared/AppError.js";
import { asyncHandler } from "../shared/asyncHandler.js";
import { getCurrentUserMemberships, isAdminEmail, isSuperAdminEmail } from "../shared/access.js";

const normalizeTask = (task) => task.populate("teamId assigneeId createdById");

export const listTasks = async ({ userEmail, userId, isAdmin = false }) => {
  const superAdmin = isAdmin || isAdminEmail(userEmail) || isSuperAdminEmail(userEmail);

  if (superAdmin) {
    return Task.find({}).sort({ createdAt: -1 }).populate("teamId assigneeId createdById");
  }

  const memberships = await getCurrentUserMemberships(userId);
  const managedTeamIds = memberships
    .filter((membership) => {
      const roleName = membership.roleId?.name?.toLowerCase();
      const permissions = membership.roleId?.permissions || [];
      return roleName === 'manager' || permissions.includes('MANAGE_USERS');
    })
    .map((membership) => membership.teamId?._id || membership.teamId)
    .filter(Boolean);

  const filter = managedTeamIds.length
    ? { $or: [{ assigneeId: userId }, { createdById: userId }, { teamId: { $in: managedTeamIds } }] }
    : { $or: [{ assigneeId: userId }, { createdById: userId }] };

  return Task.find(filter).sort({ createdAt: -1 }).populate("teamId assigneeId createdById");
};

export const createTask = async ({ title, description = "", teamId = null, assigneeId = null, dueDate = null, createdById }) => {
  if (!title || !createdById) {
    throw new AppError("Title and creator are required", 400);
  }

  return normalizeTask(await Task.create({ title, description, teamId, assigneeId, dueDate, createdById }));
};

export const updateTask = async (taskId, updates = {}) => {
  const task = await Task.findByIdAndUpdate(taskId, updates, { new: true, runValidators: true }).populate("teamId assigneeId createdById");

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return task;
};

export const completeTask = async (taskId) => updateTask(taskId, { status: "done", completedAt: new Date() });

export const undoTask = async (taskId) => updateTask(taskId, { status: "todo", completedAt: null });

export const deleteTask = async (taskId) => {
  const task = await Task.findByIdAndDelete(taskId);
  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return task;
};

const getTasksController = asyncHandler(async (req, res) => {
  const tasks = await listTasks({ userEmail: req.authUser.email, userId: req.authUser.sub, isAdmin: req.authUser.isAdmin });
  res.json(tasks);
});

const createTaskController = asyncHandler(async (req, res) => {
  const task = await createTask({ ...req.body, createdById: req.authUser.sub });
  res.status(201).json(task);
});

const updateTaskController = asyncHandler(async (req, res) => {
  const task = await updateTask(req.params.id, req.body);
  res.json(task);
});

const completeTaskController = asyncHandler(async (req, res) => {
  const task = await completeTask(req.params.id);
  res.json(task);
});

const undoTaskController = asyncHandler(async (req, res) => {
  const task = await undoTask(req.params.id);
  res.json(task);
});

const deleteTaskController = asyncHandler(async (req, res) => {
  const task = await deleteTask(req.params.id);
  res.json({ message: "Task deleted", task });
});

export const tasksRouter = Router();

tasksRouter.get("/", getTasksController);
tasksRouter.post("/", createTaskController);
tasksRouter.patch("/:id", updateTaskController);
tasksRouter.post("/:id/complete", completeTaskController);
tasksRouter.post("/:id/undo", undoTaskController);
tasksRouter.delete("/:id", deleteTaskController);