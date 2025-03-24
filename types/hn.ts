// Types for Hacker News API

type HNItemBase = {
  id: HNItemID;
  deleted?: boolean;
  dead?: boolean;
  by: string;
  time: number;
  fetchedAt: Date;
};

type HNTextAndOrUrl = HNItemBase &
  (
    | {
        text: HNItemHTMLText;
        url: string;
      }
    | {
        text: HNItemHTMLText;
        url?: never;
      }
    | {
        text?: never;
        url: string;
      }
  );

export type HNItemHTMLText = string;

export enum HNItemTypeEnum {
  job = "job",
  story = "story",
  comment = "comment",
}

export type HNItemID = number;
export type HNStoryID = number;
export type HNCommentID = number;
export type HNJobID = number;
export type HNUserID = string;

export type HNStory = HNItemBase &
  HNTextAndOrUrl & {
    type: HNItemTypeEnum.story;
    title: string;
    score: number;
    descendants: number;
    kids?: HNCommentID[];
  };
export type HNComment = HNItemBase &
  HNTextAndOrUrl & {
    type: HNItemTypeEnum.comment;
    parent: HNStoryID | HNCommentID;
    text: HNItemHTMLText;
    kids?: HNCommentID[];
  };
export type HNJob = HNItemBase & {
  type: HNItemTypeEnum.job;
  title: string;
} & HNTextAndOrUrl;

export type HNUser = {
  id: HNUserID;
  created: number;
  karma: number;
  about: string;
  submitted: number[];
  fetchedAt: Date;
};

export type HNItem = HNStory | HNComment | HNJob;
