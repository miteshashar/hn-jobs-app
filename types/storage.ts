// Types for Stores

import { HNItemID, HNItem, HNUser, HNUserID } from "@/types/hn";

export type HNStore = {
  items: Record<HNItemID, HNItem>;
  users: Record<HNUserID, HNUser>;
  loadingFromHN: boolean;
  loadingHNStore: boolean;
  setLoadingHNStore: (status: boolean) => void;
  clearHNStore: () => void;
  getUsers: (userIds: HNUserID[]) => Record<HNUserID, HNUser>;
  setUsers: (newUsers: HNUser[]) => void;
  getItems: (itemIds: HNItemID[]) => Record<HNItemID, HNItem>;
  setItems: (newItems: HNItem[]) => void;
  getItemIdsNotInStore: (itemIds: HNItemID[]) => HNItemID[];
  getJobPosts: () => HNItem[];
  refreshHN: () => Promise<void>;
  setLoadingFromHN: (status: boolean) => Promise<void>;
};
