import React from "react";
import { EnumHNItemType, THNCommentID, THNItemHTMLText } from "@/types/hn";
import { Text, View } from "./Themed";
import { FlatList } from "react-native";
import { useHNStore } from "@/stores/hn";
import { stripHtml } from "string-strip-html";

interface JobPostProps {
  id: THNCommentID;
  text: THNItemHTMLText;
  fetchedAt: Date;
  type: EnumHNItemType;
}

const JobPostListItemComponent: React.FC<JobPostProps> = (
  item: JobPostProps,
) => {
  return item.type === EnumHNItemType.comment ? (
    <View style={{ padding: 10 }}>
      <Text>{stripHtml(item.text).result}</Text>
    </View>
  ) : null;
};

export const JobPostListItem = React.memo(
  JobPostListItemComponent,
  (prevProps, nextProps) =>
    // prevProps.fetchedAt && nextProps.fetchedAt
    //   ? prevProps.fetchedAt.getTime() === nextProps.fetchedAt.getTime()
    prevProps.id === nextProps.id,
);

export const JobPostList: React.FC = () => {
  const { getJobPosts, refreshHN, loadingFromHN } = useHNStore();
  return (
    <FlatList
      data={getJobPosts().sort((a, b) => {
        if (a.time && b.time) {
          return b.time - a.time;
        }
        return 0;
      })}
      keyExtractor={(item) => "job-post-" + item.id.toString()}
      onRefresh={refreshHN}
      refreshing={loadingFromHN}
      renderItem={({ item }) => (
        <JobPostListItem
          id={item.id}
          text={item.text}
          fetchedAt={item.fetchedAt}
          type={item.type}
        />
      )}
      ItemSeparatorComponent={() => (
        <View
          style={{
            height: 1,
            width: "80%",
            marginHorizontal: "auto",
            marginVertical: 5,
          }}
          lightColor="#ddd"
          darkColor="#555"
        />
      )}
    />
  );
};
