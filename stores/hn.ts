// Zustand Store for Hacker News Items

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { hn } from "@/services/hn";
import {
  HNCommentID,
  HNItemID,
  HNItem,
  HNStory,
  HNUser,
  HNUserID,
  HNItemTypeEnum,
  HNStoryID,
  HNComment,
} from "@/types/hn";
import { HNStore } from "@/types/storage";
import {
  isHNItemRelevant,
  isHNWhoIsHiringJobPostStory,
  isItemDataStale,
  isUserDataStale,
  makeBatches,
} from "@/utils";

const MONTHS_TO_FETCH = Math.ceil(process.env.EXPO_PUBLIC_JOB_CACHE_DAYS / 30);

export const useHNStore = create<HNStore>()(
  persist(
    (set, _, store) => ({
      items: {},
      users: {},
      loadingHNStore: true,
      setLoadingHNStore: (status: boolean) => {
        set({ loadingHNStore: status });
      },
      clearHNStore: () => {
        set({
          items: {},
          users: {},
          loadingFromHN: false,
          loadingHNStore: true,
        });
        console.info("Cleared HN store");
      },
      loadingFromHN: false,
      setLoadingFromHN: async (status: boolean) => {
        set({ loadingFromHN: status });
      },
      getUsers: (userIds: HNUserID[]): Record<HNUserID, HNUser> => {
        const storeUsers = store.getState().users;
        return userIds.reduce(
          (acc, userId) => {
            const user = storeUsers[userId];
            if (!!user && !isUserDataStale(user)) {
              acc[userId] = user;
            }
            return acc;
          },
          {} as Record<HNUserID, HNUser>,
        );
      },
      setUsers: (newUsers: HNUser[]) => {
        set({
          users: {
            ...store.getState().users,
            ...newUsers.reduce(
              (acc, user) => {
                if (!isUserDataStale(user)) {
                  acc[user.id] = user;
                }
                return acc;
              },
              {} as Record<HNUserID, HNUser>,
            ),
          },
        });
      },
      getItems: (itemIds: HNItemID[]): Record<HNItemID, HNItem> => {
        const storeItems = store.getState().items;
        return itemIds.reduce(
          (acc, itemId) => {
            const item = storeItems[itemId];
            if (!!item && !isItemDataStale(item)) {
              acc[itemId] = item;
            }
            return acc;
          },
          {} as Record<HNItemID, HNItem>,
        );
      },
      setItems: (newItems: HNItem[]) => {
        set({
          items: {
            ...store.getState().items,
            ...newItems.reduce(
              (acc, item) => {
                if (!isItemDataStale(item)) {
                  acc[item.id] = item;
                }
                return acc;
              },
              {} as Record<HNItemID, HNItem>,
            ),
          },
        });
      },
      getItemIdsNotInStore: (itemIds: HNItemID[]): HNItemID[] => {
        const storeItems = store.getState().getItems(itemIds);
        const storeItemIds = Object.keys(storeItems).map((itemId) =>
          parseInt(itemId),
        );
        const itemIdsNotInStore = itemIds.filter(
          (itemId) => !storeItemIds.includes(itemId),
        );
        return itemIdsNotInStore;
      },
      getJobPosts: () => {
        const storeItems = store.getState().items;
        const whoIsHiringPostIds = Object.values(storeItems)
          .filter((item) => isHNWhoIsHiringJobPostStory(item))
          .map((item) => item.id as HNStoryID);
        const jobPosts = Object.values(storeItems).filter(
          (item) =>
            item.type === HNItemTypeEnum.comment &&
            whoIsHiringPostIds.includes(item.parent as HNStoryID) &&
            isHNItemRelevant(item),
        ) as HNComment[];
        return jobPosts;
      },
      refreshHN: async () => {
        console.info("Refreshing HN store");
        set({ loadingFromHN: true });
        let whoIsHiring: HNUser | null;
        whoIsHiring = await hn.fetchUser("whoishiring");
        if (!whoIsHiring) {
          console.error("Unable to fetch whoishiring");
          set({ loadingFromHN: false });
          return;
        }
        console.info("Fetched whoishiring user");
        store.getState().setUsers([whoIsHiring]);
        // There are always 3 Who is Hiring posts per month
        const whoIsHiringPostIds = whoIsHiring.submitted.filter(
          (_, index) => index < 3 * MONTHS_TO_FETCH,
        );
        console.info(`Fetching ${whoIsHiringPostIds.length} whoishiring posts`);
        const batches = makeBatches(
          whoIsHiringPostIds,
          process.env.EXPO_PUBLIC_HN_FETCH_BATCH_SIZE,
        );
        const whoIsHiringPosts = (
          await Promise.all(
            batches.map(async (batch) => {
              return hn.fetchItems(batch) as Promise<HNStory[]>;
            }),
          )
        )
          .flat()
          .filter(
            (post) =>
              isHNItemRelevant(post) && isHNWhoIsHiringJobPostStory(post),
          );
        store.getState().setItems(whoIsHiringPosts);
        console.info(
          `Fetched & saved ${whoIsHiringPosts.length} whoishiring posts`,
        );
        let jobPostCommentIdsNotInStore = store
          .getState()
          .getItemIdsNotInStore(
            whoIsHiringPosts
              .map((post) => post.kids || [])
              .flat() as HNCommentID[],
          );
        console.info(
          `Fetching ${jobPostCommentIdsNotInStore.length} job post comments`,
        );

        // Fetch job post comments in batches
        let jobPostCommentBatches = makeBatches(
          jobPostCommentIdsNotInStore,
          process.env.EXPO_PUBLIC_HN_FETCH_BATCH_SIZE,
        );
        for (const batch of jobPostCommentBatches) {
          const jobPostComments = (await hn.fetchItems(batch)) as HNComment[];
          store.getState().setItems(jobPostComments);
          console.info(
            `Fetched & saved ${jobPostComments.length} job post comments`,
          );
          // TODO: Fetch comment users & replies either here or on view load
        }

        set({ loadingFromHN: false });
      },
    }),
    {
      name: "hn-items",
      storage: createJSONStorage<HNStore>(() => AsyncStorage),
      onRehydrateStorage: () => {
        console.info("Rehydrating HN store");
        return (state) => {
          console.info("Reset epehemeral state");
          state?.setLoadingHNStore(true);
          state?.setLoadingFromHN(false);
          const displayInfo = () => {
            if (!state) {
              console.warn("Current HN store is empty");
              return;
            }
            console.debug(
              "Current HN store = Users:",
              Object.keys(state.users).length,
              "Items:",
              Object.keys(state.items).length,
              "Loading from HN:",
              state.loadingFromHN,
              "Loading HN store:",
              state.loadingHNStore,
            );
          };
          displayInfo();

          // Uncomment the following lines to clear the store on rehydration
          // Meant for debugging purposes
          // console.info("Clearing HN store");
          // state?.clearHNStore();
          // displayInfo();

          state?.setLoadingHNStore(false);
          console.info("Rehydrated store");
          displayInfo();
          console.info("Refreshing store on load");
          state
            ?.refreshHN()
            .then(() => {
              console.info("Rehydrated store and refreshed HN");
            })
            .catch((e: Error) => {
              console.error("Error refreshing HN on load", e);
            });
        };
      },
    },
  ),
);
