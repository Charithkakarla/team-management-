// Access helpers: stores the admin and manager email rules in one place.
// It defines which emails count as admin or manager.
// Use this file to understand the access identity rules.
import { Membership } from "../dataModels/Membership.js";

export const getAdminEmail = () => (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase();

export const getManagerEmail = () => (process.env.MANAGER_EMAIL || '23071a6628@vnrvjiet.in').toLowerCase();

export const getPrivilegedEmails = () => [getAdminEmail(), getManagerEmail()];

export const isAdminEmail = (email) => Boolean(email) && email.toLowerCase() === getAdminEmail();

export const isManagerEmail = (email) => Boolean(email) && email.toLowerCase() === getManagerEmail();

export const isPrivilegedEmail = (email) => isAdminEmail(email) || isManagerEmail(email);

export const hasAdminAccess = async (userId) => {
	const memberships = await getCurrentUserMemberships(userId);

	return memberships.some((membership) => membership.roleId?.name?.toLowerCase() === 'admin');
};

export const getCurrentUserMemberships = async (userId) => {
	if (!userId) {
		return [];
	}

	return Membership.find({ userId }).populate('roleId teamId');
};

export const hasManagerAccess = async (userId) => {
	const memberships = await getCurrentUserMemberships(userId);

	return memberships.some((membership) => membership.roleId?.name?.toLowerCase() === 'manager');
};
