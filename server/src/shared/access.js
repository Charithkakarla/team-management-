// Access helpers: stores the superadmin and manager email rules in one place.
// It defines which emails count as superadmin, admin, or manager.
// Use this file to understand the access identity rules.
import { Membership } from "../dataModels/Membership.js";

export const getSuperAdminEmail = () => (process.env.SUPERADMIN_EMAIL || process.env.ADMIN_EMAIL || process.env.CEO_EMAIL || 'kakarlacharith3366@gmail.com').toLowerCase();

export const getAdminEmail = getSuperAdminEmail;

export const getManagerEmail = () => (process.env.MANAGER_EMAIL || '23071a6628@vnrvjiet.in').toLowerCase();

export const getPrivilegedEmails = () => [getSuperAdminEmail(), getManagerEmail()];

export const isSuperAdminEmail = (email) => Boolean(email) && email.toLowerCase() === getSuperAdminEmail();

export const isCEOEmail = isSuperAdminEmail;

export const isManagerEmail = (email) => Boolean(email) && email.toLowerCase() === getManagerEmail();

export const isPrivilegedEmail = (email) => isCEOEmail(email) || isManagerEmail(email);

export const isAdminEmail = isSuperAdminEmail;

export const getCurrentUserMemberships = async (userId) => {
	if (!userId) {
		return [];
	}

	return Membership.find({ userId }).populate('roleId teamId');
};

export const hasManagerAccess = async (userId) => {
	const memberships = await getCurrentUserMemberships(userId);

	return memberships.some((membership) => {
		const roleName = membership.roleId?.name?.toLowerCase();
		const permissions = membership.roleId?.permissions || [];
		return roleName === 'manager' || permissions.includes('MANAGE_USERS');
	});
};
