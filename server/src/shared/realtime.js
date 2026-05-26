// Realtime hub: tracks SSE subscribers and broadcasts role-change events.
// It keeps the connection handling isolated from feature logic.
// Use this file to notify clients after membership updates.
const subscribersByUserId = new Map();

const addSubscriber = (userId, subscriber) => {
  const key = String(userId);
  const subscribers = subscribersByUserId.get(key) || new Set();
  subscribers.add(subscriber);
  subscribersByUserId.set(key, subscribers);
};

const removeSubscriber = (userId, subscriber) => {
  const key = String(userId);
  const subscribers = subscribersByUserId.get(key);
  if (!subscribers) {
    return;
  }

  subscribers.delete(subscriber);
  if (subscribers.size === 0) {
    subscribersByUserId.delete(key);
  }
};

export const subscribeToUser = (userId, res) => {
  const subscriber = { res };
  addSubscriber(userId, subscriber);

  res.write('event: connected\n');
  res.write(`data: ${JSON.stringify({ type: 'connected', userId: String(userId) })}\n\n`);

  const cleanup = () => removeSubscriber(userId, subscriber);
  reqSafeClose(res, cleanup);

  return cleanup;
};

const reqSafeClose = (res, cleanup) => {
  res.on('close', cleanup);
  res.on('finish', cleanup);
};

export const emitRoleChange = ({ userId, teamId, roleId, roleName, permissions }) => {
  const key = String(userId);
  const subscribers = subscribersByUserId.get(key);
  if (!subscribers || subscribers.size === 0) {
    return;
  }

  const payload = JSON.stringify({
    type: 'role-change',
    userId: key,
    teamId: teamId ? String(teamId) : null,
    roleId: roleId ? String(roleId) : null,
    roleName: roleName || null,
    permissions: permissions || []
  });

  for (const subscriber of subscribers) {
    subscriber.res.write(`event: role-change\n`);
    subscriber.res.write(`data: ${payload}\n\n`);
  }
};
