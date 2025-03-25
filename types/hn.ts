// Types for Hacker News API

type THNItemBase = {
  id: THNItemID;
  deleted?: boolean;
  dead?: boolean;
  by: string;
  time: number;
  fetchedAt: Date;
};

type THNTextAndOrUrl = THNItemBase &
  (
    | {
        text: THNItemHTMLText;
        url: string;
      }
    | {
        text: THNItemHTMLText;
        url?: never;
      }
    | {
        text?: never;
        url: string;
      }
  );

export type THNItemHTMLText = string;

export enum EnumHNItemType {
  job = "job",
  story = "story",
  comment = "comment",
}

export type THNItemID = number;
export type THNStoryID = number;
export type THNCommentID = number;
export type THNJobID = number;
export type THNUserID = string;

export type THNStory = THNItemBase &
  THNTextAndOrUrl & {
    type: EnumHNItemType.story;
    title: string;
    score: number;
    descendants: number;
    kids?: THNCommentID[];
  };
export type THNComment = THNItemBase &
  THNTextAndOrUrl & {
    type: EnumHNItemType.comment;
    parent: THNStoryID | THNCommentID;
    text: THNItemHTMLText;
    kids?: THNCommentID[];
  };
export type THNJob = THNItemBase & {
  type: EnumHNItemType.job;
  title: string;
} & THNTextAndOrUrl;

export type THNUser = {
  id: THNUserID;
  created: number;
  karma: number;
  about: string;
  submitted: number[];
  fetchedAt: Date;
};

export type THNItem = THNStory | THNComment | THNJob;
