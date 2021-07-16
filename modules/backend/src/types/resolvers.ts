import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from "graphql";
import {
  Challenge,
  ChallengeParticipation,
  Marking,
  User,
} from "@prisma/client";
import * as Types from "./schema";
import { CustomContext } from "./customContext";

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X];
} &
  { [P in K]-?: NonNullable<T[P]> };

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> =
  | LegacyStitchingResolver<TResult, TParent, TContext, TArgs>
  | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Types.Maybe<TTypes> | Promise<Types.Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Types.Scalars["String"]>;
  ID: ResolverTypeWrapper<Types.Scalars["ID"]>;
  Mutation: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Types.Scalars["Boolean"]>;
  Date: ResolverTypeWrapper<Types.Scalars["Date"]>;
  DateFilter: Types.DateFilter;
  User: ResolverTypeWrapper<User>;
  LoginResult: ResolverTypeWrapper<
    Omit<Types.LoginResult, "user"> & { user: ResolversTypes["User"] }
  >;
  PasswordInput: Types.PasswordInput;
  ChallengeStatus: Types.ChallengeStatus;
  Challenge: ResolverTypeWrapper<Challenge>;
  ChallengeParticipation: ResolverTypeWrapper<ChallengeParticipation>;
  CreateChallengeInput: Types.CreateChallengeInput;
  UpdateChallengeInput: Types.UpdateChallengeInput;
  Marking: ResolverTypeWrapper<Marking>;
  Int: ResolverTypeWrapper<Types.Scalars["Int"]>;
  MarkingCreateInput: Types.MarkingCreateInput;
  MarkingUpdateInput: Types.MarkingUpdateInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {};
  String: Types.Scalars["String"];
  ID: Types.Scalars["ID"];
  Mutation: {};
  Boolean: Types.Scalars["Boolean"];
  Date: Types.Scalars["Date"];
  DateFilter: Types.DateFilter;
  User: User;
  LoginResult: Omit<Types.LoginResult, "user"> & {
    user: ResolversParentTypes["User"];
  };
  PasswordInput: Types.PasswordInput;
  Challenge: Challenge;
  ChallengeParticipation: ChallengeParticipation;
  CreateChallengeInput: Types.CreateChallengeInput;
  UpdateChallengeInput: Types.UpdateChallengeInput;
  Marking: Marking;
  Int: Types.Scalars["Int"];
  MarkingCreateInput: Types.MarkingCreateInput;
  MarkingUpdateInput: Types.MarkingUpdateInput;
};

export type QueryResolvers<
  ContextType = CustomContext,
  ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"]
> = {
  _empty?: Resolver<
    Types.Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  getUser?: Resolver<
    Types.Maybe<ResolversTypes["User"]>,
    ParentType,
    ContextType,
    RequireFields<Types.QueryGetUserArgs, "name">
  >;
  getCurrentUser?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
  getUsers?: Resolver<
    Types.Maybe<Array<ResolversTypes["User"]>>,
    ParentType,
    ContextType
  >;
  getChallenge?: Resolver<
    Types.Maybe<ResolversTypes["Challenge"]>,
    ParentType,
    ContextType,
    RequireFields<Types.QueryGetChallengeArgs, "id">
  >;
  getChallenges?: Resolver<
    Array<ResolversTypes["Challenge"]>,
    ParentType,
    ContextType,
    RequireFields<Types.QueryGetChallengesArgs, never>
  >;
  getUserParticipations?: Resolver<
    Array<ResolversTypes["ChallengeParticipation"]>,
    ParentType,
    ContextType
  >;
  getParticipation?: Resolver<
    Types.Maybe<ResolversTypes["ChallengeParticipation"]>,
    ParentType,
    ContextType,
    RequireFields<Types.QueryGetParticipationArgs, "challengeId" | "userName">
  >;
  getMarkings?: Resolver<
    Array<ResolversTypes["Marking"]>,
    ParentType,
    ContextType,
    RequireFields<Types.QueryGetMarkingsArgs, "participationId">
  >;
  getUserTransferParticipation?: Resolver<
    Types.Maybe<ResolversTypes["ChallengeParticipation"]>,
    ParentType,
    ContextType
  >;
};

export type MutationResolvers<
  ContextType = CustomContext,
  ParentType extends ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"]
> = {
  _empty?: Resolver<
    Types.Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  deleteUser?: Resolver<
    ResolversTypes["Boolean"],
    ParentType,
    ContextType,
    RequireFields<Types.MutationDeleteUserArgs, "name">
  >;
  editUser?: Resolver<
    ResolversTypes["LoginResult"],
    ParentType,
    ContextType,
    RequireFields<Types.MutationEditUserArgs, never>
  >;
  login?: Resolver<
    ResolversTypes["LoginResult"],
    ParentType,
    ContextType,
    RequireFields<Types.MutationLoginArgs, "name" | "password">
  >;
  register?: Resolver<
    ResolversTypes["LoginResult"],
    ParentType,
    ContextType,
    RequireFields<Types.MutationRegisterArgs, "name" | "password" | "isPrivate">
  >;
  logout?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  addFinishedChallenge?: Resolver<
    ResolversTypes["Boolean"],
    ParentType,
    ContextType,
    RequireFields<Types.MutationAddFinishedChallengeArgs, "challengeId">
  >;
  createChallenge?: Resolver<
    ResolversTypes["Challenge"],
    ParentType,
    ContextType,
    RequireFields<Types.MutationCreateChallengeArgs, "challenge">
  >;
  updateChallenge?: Resolver<
    ResolversTypes["Challenge"],
    ParentType,
    ContextType,
    RequireFields<Types.MutationUpdateChallengeArgs, "id" | "args">
  >;
  deleteChallenge?: Resolver<
    ResolversTypes["Boolean"],
    ParentType,
    ContextType,
    RequireFields<Types.MutationDeleteChallengeArgs, "id">
  >;
  createParticipation?: Resolver<
    ResolversTypes["ChallengeParticipation"],
    ParentType,
    ContextType,
    RequireFields<
      Types.MutationCreateParticipationArgs,
      "challengeId" | "isPrivate"
    >
  >;
  deleteParticipation?: Resolver<
    ResolversTypes["Boolean"],
    ParentType,
    ContextType,
    RequireFields<Types.MutationDeleteParticipationArgs, "challengeId">
  >;
  addMarking?: Resolver<
    ResolversTypes["Marking"],
    ParentType,
    ContextType,
    RequireFields<Types.MutationAddMarkingArgs, "participationId" | "marking">
  >;
  editMarking?: Resolver<
    ResolversTypes["Marking"],
    ParentType,
    ContextType,
    RequireFields<Types.MutationEditMarkingArgs, "id" | "marking">
  >;
  deleteMarking?: Resolver<
    ResolversTypes["Boolean"],
    ParentType,
    ContextType,
    RequireFields<Types.MutationDeleteMarkingArgs, "id">
  >;
  transferUserMarkings?: Resolver<
    ResolversTypes["Boolean"],
    ParentType,
    ContextType,
    RequireFields<Types.MutationTransferUserMarkingsArgs, "challengeId">
  >;
};

export interface DateScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Date"], any> {
  name: "Date";
}

export type UserResolvers<
  ContextType = CustomContext,
  ParentType extends ResolversParentTypes["User"] = ResolversParentTypes["User"]
> = {
  name?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  isPrivate?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  email?: Resolver<
    Types.Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  participations?: Resolver<
    Array<ResolversTypes["ChallengeParticipation"]>,
    ParentType,
    ContextType
  >;
  activeParticipation?: Resolver<
    Types.Maybe<ResolversTypes["ChallengeParticipation"]>,
    ParentType,
    ContextType,
    RequireFields<Types.UserActiveParticipationArgs, never>
  >;
  finishedAndCheckedChallenges?: Resolver<
    Array<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LoginResultResolvers<
  ContextType = CustomContext,
  ParentType extends ResolversParentTypes["LoginResult"] = ResolversParentTypes["LoginResult"]
> = {
  accessToken?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  user?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ChallengeResolvers<
  ContextType = CustomContext,
  ParentType extends ResolversParentTypes["Challenge"] = ResolversParentTypes["Challenge"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  description?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  startDate?: Resolver<
    Types.Maybe<ResolversTypes["Date"]>,
    ParentType,
    ContextType
  >;
  endDate?: Resolver<
    Types.Maybe<ResolversTypes["Date"]>,
    ParentType,
    ContextType
  >;
  status?: Resolver<ResolversTypes["ChallengeStatus"], ParentType, ContextType>;
  creator?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
  isPrivate?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  participations?: Resolver<
    Array<ResolversTypes["ChallengeParticipation"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ChallengeParticipationResolvers<
  ContextType = CustomContext,
  ParentType extends ResolversParentTypes["ChallengeParticipation"] = ResolversParentTypes["ChallengeParticipation"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  challenge?: Resolver<ResolversTypes["Challenge"], ParentType, ContextType>;
  user?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
  markings?: Resolver<
    Array<ResolversTypes["Marking"]>,
    ParentType,
    ContextType
  >;
  isPrivate?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MarkingResolvers<
  ContextType = CustomContext,
  ParentType extends ResolversParentTypes["Marking"] = ResolversParentTypes["Marking"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  date?: Resolver<ResolversTypes["Date"], ParentType, ContextType>;
  rating?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  isPrivate?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  comment?: Resolver<
    Types.Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  photoUrl?: Resolver<
    Types.Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = CustomContext> = {
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Date?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  LoginResult?: LoginResultResolvers<ContextType>;
  Challenge?: ChallengeResolvers<ContextType>;
  ChallengeParticipation?: ChallengeParticipationResolvers<ContextType>;
  Marking?: MarkingResolvers<ContextType>;
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = CustomContext> = Resolvers<ContextType>;
