// Toast hook: exposes the shared notification helpers.
// It lets components show success and error messages.
// Use this file when a screen needs toast notifications.
import { useToast as useToastContext } from '../state/ToastContext';

export const useToast = useToastContext;
