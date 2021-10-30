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

export interface ChallengeFilters {
  creatorName?: string | null;
  status?: ChallengeStatus | null;
  startDate?: DateFilter | null;
  endDate?: DateFilter | null;
}

export interface CreateChallengeInput {
  name: string;
  description: string;
  isPrivate: boolean;
  startDate?: any | null;
  endDate?: any | null;
  photoUrl?: string | null;
}

export interface CreateParticipationInput {
  challengeId: string;
  isPrivate: boolean;
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
  isPrivate: boolean;
  comment?: string | null;
  date?: any | null;
  photoUrl?: string | null;
}

export interface MarkingUpdateInput {
  isPrivate?: boolean | null;
  rating?: number | null;
  comment?: string | null;
  date?: any | null;
  photoUrl?: string | null;
}

export interface ParticipationFilters {
  participantName?: string | null;
  startDate?: DateFilter | null;
  endDate?: DateFilter | null;
}

export interface PasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateChallengeInput {
  name?: string | null;
  description?: string | null;
  isPrivate?: boolean | null;
  startDate?: any | null;
  endDate?: any | null;
  photoUrl?: string | null;
}

export interface UpdateParticipationInput {
  isPrivate?: boolean | null;
  startDate?: any | null;
  endDate?: any | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
