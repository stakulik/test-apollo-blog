import { PostEventType } from './post-event-type.enum';

export interface PostJobData {
  postId: string;
  eventType: PostEventType;
  metadata?: Record<string, unknown>;
}
