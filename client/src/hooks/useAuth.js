// Auth hook: exposes the shared authentication context.
// It gives components access to login state and logout.
// Use this file when a component needs the current user.
import { useAuth as useAuthContext } from '../state/AuthContext';

export const useAuth = useAuthContext;
