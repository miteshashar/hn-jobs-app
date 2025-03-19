// Types for Hacker News API

type HNItemBaseType = {
  id: HNItemIDType;
  deleted?: boolean;
  dead?: boolean;
  by: string;
  time: number;
};

type TextAndOrUrlType = HNItemBaseType &
  (
    | {
        text: ItemHTMLTextType;
        url: string;
      }
    | {
        text: ItemHTMLTextType;
        url?: never;
      }
    | {
        text?: never;
        url: string;
      }
  );

export type ItemHTMLTextType = string;

export enum HNItemTypeEnum {
  job = 'job',
  story = 'story',
  comment = 'comment',
};

export type HNItemIDType = number;
export type HNStoryIDType = number;
export type HNCommentIDType = number;
export type HNJobIDType = number;
export type HNUserIDType = string;

export type HNStoryType = HNItemBaseType & TextAndOrUrlType & {
  type: HNItemTypeEnum.story;
  title: string;
  score: number;
  descendants: number;
  kids?: HNCommentIDType[];
}
export type HNCommentType = HNItemBaseType & TextAndOrUrlType & {
  type: HNItemTypeEnum.comment;
  parent: HNStoryIDType | HNCommentIDType;
  text: ItemHTMLTextType;
  kids?: HNCommentIDType[];
}
export type HNJobType = HNItemBaseType & {
  type: HNItemTypeEnum.job;
  title: string;
} & TextAndOrUrlType;

export type HNUserType = {
  id: HNUserIDType;
  created: number;
  karma: number;
  about: string;
  submitted: number[];
};

export type HNItemType = HNStoryType | HNCommentType | HNJobType;