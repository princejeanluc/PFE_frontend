import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export function formatTimeAgo(timestamp: number): string {
  return formatDistanceToNow(Date.now() - timestamp, { addSuffix: true , locale: fr});
}