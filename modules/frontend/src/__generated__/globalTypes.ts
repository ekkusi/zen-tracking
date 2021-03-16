/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum ChallengeStatus {
  ACTIVE = "ACTIVE",
  ENDED = "ENDED",
  SUGGESTION = "SUGGESTION",
  UPCOMING = "UPCOMING",
}

export enum UserCheckStatus {
  INVALID_PASSWORD = "INVALID_PASSWORD",
  USER_AND_PASSWORD_FOUND = "USER_AND_PASSWORD_FOUND",
  USER_NOT_FOUND_BUT_CREATED = "USER_NOT_FOUND_BUT_CREATED",
}

export interface CreateChallengeInput {
  name: string;
  description: string;
  creatorName: string;
  startDate?: any | null;
  endDate?: any | null;
}

export interface DateFilter {
  gte?: string | null;
  gt?: string | null;
  lte?: string | null;
  lt?: string | null;
}

export interface MarkingInput {
  comment?: string | null;
  date?: any | null;
  photoUrl?: string | null;
}

export interface UpdateChallengeInput {
  name?: string | null;
  description?: string | null;
  startDate?: any | null;
  endDate?: any | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
