import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { ActivityIndicator, Pressable } from "react-native";
import { useHNStore } from "@/stores/hn";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { refreshHN, loadingFromHN, loadingHNStore } = useHNStore();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Jobs",
          headerTitle: "Jobs on Hacker News",
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
          headerRight: () => (
            <Pressable
              disabled={loadingHNStore || loadingFromHN}
              onPress={refreshHN}
            >
              {({ pressed }) =>
                loadingHNStore || loadingFromHN ? (
                  <ActivityIndicator
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{
                      marginRight: 15,
                      opacity: 0.4,
                    }}
                  />
                ) : (
                  <FontAwesome
                    name="refresh"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{
                      marginRight: 15,
                    }}
                  />
                )
              }
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="filters"
        options={{
          title: "Filters",
          tabBarIcon: ({ color }) => <TabBarIcon name="filter" color={color} />,
        }}
      />
    </Tabs>
  );
}
