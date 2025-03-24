import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";

import { useHNStore } from "@/stores/hn";
import { Suspense } from "react";

export default function JobsScreen() {
  const hnStore = useHNStore();
  const { items, users, loadingFromHN, loadingHNStore, getJobPosts } = hnStore;

  // useEffect(() => {
  //   const { refreshHN: internalRefreshHN, loadingFromHN: loading } =
  //     useHNStore.getState();
  //   if (!loading) {
  //     internalRefreshHN()
  //       .then(() => {
  //         console.debug("JobsScreen: refreshHN finished");
  //       })
  //       .catch((error) => {
  //         console.error("JobsScreen: refreshHN error", error);
  //       });
  //   } else {
  //     console.debug("JobsScreen: refreshHN already in progress");
  //   }
  // }, []);

  return (
    <Suspense fallback={<View style={styles.container}>Loading app...</View>}>
      {!loadingHNStore && (
        <View style={styles.container}>
          <Text style={{ marginTop: 10 }}>
            HN Items: {Object.keys(items).length}
          </Text>
          <Text style={{ marginTop: 10 }}>
            Relevant Job Posts: {getJobPosts().length}
          </Text>
          <Text style={{ marginTop: 10 }}>
            <Text>Users: </Text>
            {Object.keys(users).length > 0 &&
              Object.values(users)
                .map((user) => user.id)
                .join(", ")}
            {!Object.keys(users).length && "None"}
          </Text>
          <Text style={{ marginTop: 10 }}>
            {loadingFromHN ? "Loading from Hacker News..." : " "}
          </Text>
        </View>
      )}
    </Suspense>
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
