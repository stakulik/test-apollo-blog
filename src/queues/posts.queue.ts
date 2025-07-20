/* eslint-disable @typescript-eslint/no-floating-promises */
import Bull from 'bull';

import { Post } from '../models';
import { appConfig } from '../config';

import { PostEventType, PostJobData } from './typings';

if (!appConfig.redis.url) {
  throw new Error('Redis URL is not defined');
}

export const postsQueue = new Bull('posts processing', appConfig.redis.url);

async function handleModerationEvent(postId: string): Promise<void> {
  await Post.update(
    { moderated_at: new Date() },
    { where: { id: postId } },
  );
}

postsQueue.process(async (job) => {
  const { postId, eventType }: PostJobData = job.data;

  switch (eventType) {
    case PostEventType.MODERATION:
      await handleModerationEvent(postId);
      break;
    default:
      console.warn(`Unknown post event type: ${eventType}`);
  }
});

export const addPostJob = (data: PostJobData) => postsQueue.add(data);

export const addModerationJob = (postId: string) => addPostJob({ postId, eventType: PostEventType.MODERATION });
