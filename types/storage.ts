// Types for Stores

import { THNItemID, THNItem, THNUser, THNUserID, THNComment } from "@/types/hn";

export type THNStore = {
  items: Record<THNItemID, THNItem>;
  users: Record<THNUserID, THNUser>;
  loadingFromHN: boolean;
  loadingHNStore: boolean;
  setLoadingHNStore: (status: boolean) => void;
  clearHNStore: () => void;
  getUsers: (userIds: THNUserID[]) => Record<THNUserID, THNUser>;
  setUsers: (newUsers: THNUser[]) => void;
  getItems: (itemIds: THNItemID[]) => Record<THNItemID, THNItem>;
  setItems: (newItems: THNItem[]) => void;
  getItemIdsNotInStore: (itemIds: THNItemID[]) => THNItemID[];
  getJobPosts: () => THNComment[];
  refreshHN: () => Promise<void>;
  setLoadingFromHN: (status: boolean) => Promise<void>;
};
