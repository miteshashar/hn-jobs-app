// Hacker News API Service

import axios from "axios";
import { HNItemID, HNItem, HNUserID, HNUser } from "@/types/hn";

const fetchItem = async (id: HNItemID): Promise<HNItem | null> => {
  const response = await axios.get(
    `${process.env.EXPO_PUBLIC_HN_API_URL}/item/${id}.json`,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );
  if (response.status !== 200) {
    console.debug(`Error fetching item ${id}: ${response.statusText}`);
    return null;
  }
  if (response.data === null) {
    console.debug(`Item ${id} not found`);
    return null;
  } else {
    response.data.fetchedAt = Date.now() / 1000;
  }
  return response.data as HNItem | null;
};

const fetchItems = async (ids: HNItemID[]): Promise<(HNItem | null)[]> => {
  const promises = ids.map((id) => fetchItem(id));
  return await Promise.all(promises);
};

const fetchUser = async (id: HNUserID): Promise<HNUser | null> => {
  const response = await axios.get(
    `${process.env.EXPO_PUBLIC_HN_API_URL}/user/${id}.json`,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );
  if (response.status !== 200) {
    console.debug(`Error fetching user ${id}: ${response.statusText}`);
    return null;
  }
  if (response.data === null) {
    console.debug(`User ${id} not found`);
    return null;
  } else {
    response.data.fetchedAt = Date.now() / 1000;
  }
  return response.data as HNUser | null;
};

export const hn = {
  fetchItem,
  fetchItems,
  fetchUser,
};
