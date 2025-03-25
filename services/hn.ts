// Hacker News API Service

import axios from "axios";
import { THNItemID, THNItem, THNUserID, THNUser } from "@/types/hn";

const fetchItem = async (id: THNItemID): Promise<THNItem | null> => {
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
  return response.data as THNItem | null;
};

const fetchItems = async (ids: THNItemID[]): Promise<(THNItem | null)[]> => {
  const promises = ids.map((id) => fetchItem(id));
  return await Promise.all(promises);
};

const fetchUser = async (id: THNUserID): Promise<THNUser | null> => {
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
  return response.data as THNUser | null;
};

export const hn = {
  fetchItem,
  fetchItems,
  fetchUser,
};
