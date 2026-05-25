// Access helpers: stores the CEO and manager email rules in one place.
// It defines which emails count as admin or manager.
// Use this file to understand the access identity rules.
export const getAdminEmail = () => (process.env.ADMIN_EMAIL || process.env.CEO_EMAIL || 'kakarlacharith3366@gmail.com').toLowerCase();

export const getManagerEmail = () => (process.env.MANAGER_EMAIL || '23071a6628@vnrvjiet.in').toLowerCase();

export const getPrivilegedEmails = () => [getAdminEmail(), getManagerEmail()];

export const isCEOEmail = (email) => Boolean(email) && email.toLowerCase() === getAdminEmail();

export const isManagerEmail = (email) => Boolean(email) && email.toLowerCase() === getManagerEmail();

export const isPrivilegedEmail = (email) => isCEOEmail(email) || isManagerEmail(email);

export const isAdminEmail = isCEOEmail;
