interface ImportMetaEnv {
  readonly EXPO_PUBLIC_HN_API_URL: string;
  readonly EXPO_PUBLIC_JOB_CACHE_DAYS: number;
  readonly EXPO_PUBLIC_HN_FETCH_BATCH_SIZE: number;
  readonly EXPO_PUBLIC_HN_USER_CACHE_HOURS: number;
  readonly EXPO_PUBLIC_HN_ITEM_CACHE_HOURS: number;
}

declare const process: {
  env: ImportMetaEnv;
};
