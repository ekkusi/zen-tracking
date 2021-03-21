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

export interface CreateChallengeInput {
  name: string;
  description: string;
  startDate?: any | null;
  endDate?: any | null;
}

export interface DateFilter {
  gte?: string | null;
  gt?: string | null;
  lte?: string | null;
  lt?: string | null;
}

export interface MarkingCreateInput {
  rating: number;
  comment?: string | null;
  date?: any | null;
  photoUrl?: string | null;
}

export interface MarkingUpdateInput {
  rating?: number | null;
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
