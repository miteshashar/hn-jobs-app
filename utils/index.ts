// Utility functions for the application

import { THNItem, EnumHNItemType, THNUser } from "@/types/hn";

export function isHNWhoIsHiringJobPostStory(item: THNItem): boolean {
  return (
    item.type === EnumHNItemType.story &&
    item.title.startsWith("Ask HN: Who is hiring?")
  );
}

export function makeBatches<T>(items: T[], batchSize: number): T[][] {
  return items.reduce((acc: T[][], item: T) => {
    if (acc.length === 0 || acc[acc.length - 1].length >= batchSize) {
      acc.push([item]);
    } else {
      acc[acc.length - 1].push(item);
    }
    return acc;
  }, [] as T[][]);
}

export function getHoursSince(since: Date | number): number {
  if (typeof since === "number") {
    if (since < 1160418111000) {
      // 1160418111000 was the first timestamp in the HN API
      since = new Date(since * 1000);
    }
    since = new Date(since);
  }
  // Convert to UTC
  since = new Date(since.getTime() + since.getTimezoneOffset() * 60000);
  return (new Date().getTime() - since.getTime()) / 3600000;
}
export function getDaysSince(since: Date | number): number {
  return getHoursSince(since) / 24;
}

export function isHNItemRelevant(item: THNItem): boolean {
  return !(
    item.deleted ||
    item.dead ||
    getDaysSince(item.time) > process.env.EXPO_PUBLIC_JOB_CACHE_DAYS
  );
}

export function isItemDataStale(item: THNItem): boolean {
  return (
    getHoursSince(item.fetchedAt) > process.env.EXPO_PUBLIC_HN_ITEM_CACHE_HOURS
  );
}
export function isUserDataStale(user: THNUser): boolean {
  return (
    getHoursSince(user.fetchedAt) > process.env.EXPO_PUBLIC_HN_USER_CACHE_HOURS
  );
}
