import { ActivityIndicator, StyleSheet } from "react-native";
import { View } from "@/components/Themed";

import { useColorScheme } from "@/components/useColorScheme";
import { useHNStore } from "@/stores/hn";
import { JobPostList } from "@/components/JobPost";
import Colors from "@/constants/Colors";

export default function JobsScreen() {
  const hnStore = useHNStore();
  const colorScheme = useColorScheme();
  const { loadingHNStore } = hnStore;

  return (
    <View style={styles.container}>
      {loadingHNStore ? (
        <ActivityIndicator
          size={100}
          color={Colors[colorScheme ?? "light"].text}
        />
      ) : (
        <JobPostList />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
