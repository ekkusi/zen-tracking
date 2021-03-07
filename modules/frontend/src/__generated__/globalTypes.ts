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

export interface MarkingInput {
  comment?: string | null;
  date?: any | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
