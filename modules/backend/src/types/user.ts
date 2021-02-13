import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from "graphql";
import { CustomContext } from "./customContext";

export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X];
} &
  { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};

export type Query = {
  __typename?: "Query";
  getUser: User;
  getUsers?: Maybe<Array<User>>;
  checkUser: UserCheckResult;
};

export type QueryGetUserArgs = {
  name: Scalars["ID"];
};

export type QueryCheckUserArgs = {
  name: Scalars["ID"];
  password: Scalars["String"];
};

export type User = {
  __typename?: "User";
  name: Scalars["ID"];
  isPrivate: Scalars["Boolean"];
  markings: Array<Marking>;
};

export type UserCheckResult = {
  __typename?: "UserCheckResult";
  user?: Maybe<User>;
  status: UserCheckStatus;
};

export type Mutation = {
  __typename?: "Mutation";
  addUser: User;
  addMarking: Marking;
};

export type MutationAddUserArgs = {
  name: Scalars["ID"];
  password: Scalars["String"];
  isPrivate?: Maybe<Scalars["Boolean"]>;
};

export type MutationAddMarkingArgs = {
  userName: Scalars["ID"];
  marking: MarkingInput;
};

export type MarkingInput = {
  activities?: Maybe<Array<Scalars["String"]>>;
  comment?: Maybe<Scalars["String"]>;
};

export type Marking = {
  __typename?: "Marking";
  id: Scalars["ID"];
  date: Scalars["Date"];
  activities?: Maybe<Array<Scalars["String"]>>;
  comment?: Maybe<Scalars["String"]>;
};

export enum UserCheckStatus {
  UserAndPasswordFound = "USER_AND_PASSWORD_FOUND",
  UserNotFoundButCreated = "USER_NOT_FOUND_BUT_CREATED",
  InvalidPassword = "INVALID_PASSWORD",
}

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
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

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
  ID: ResolverTypeWrapper<Scalars["ID"]>;
  String: ResolverTypeWrapper<Scalars["String"]>;
  User: ResolverTypeWrapper<User>;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
  UserCheckResult: ResolverTypeWrapper<UserCheckResult>;
  Mutation: ResolverTypeWrapper<{}>;
  MarkingInput: MarkingInput;
  Marking: ResolverTypeWrapper<Marking>;
  UserCheckStatus: UserCheckStatus;
  Date: ResolverTypeWrapper<Scalars["Date"]>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {};
  ID: Scalars["ID"];
  String: Scalars["String"];
  User: User;
  Boolean: Scalars["Boolean"];
  UserCheckResult: UserCheckResult;
  Mutation: {};
  MarkingInput: MarkingInput;
  Marking: Marking;
  Date: Scalars["Date"];
};

export type QueryResolvers<
  ContextType = CustomContext,
  ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"]
> = {
  getUser?: Resolver<
    ResolversTypes["User"],
    ParentType,
    ContextType,
    RequireFields<QueryGetUserArgs, "name">
  >;
  getUsers?: Resolver<
    Maybe<Array<ResolversTypes["User"]>>,
    ParentType,
    ContextType
  >;
  checkUser?: Resolver<
    ResolversTypes["UserCheckResult"],
    ParentType,
    ContextType,
    RequireFields<QueryCheckUserArgs, "name" | "password">
  >;
};

export type UserResolvers<
  ContextType = CustomContext,
  ParentType extends ResolversParentTypes["User"] = ResolversParentTypes["User"]
> = {
  name?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  isPrivate?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  markings?: Resolver<
    Array<ResolversTypes["Marking"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserCheckResultResolvers<
  ContextType = CustomContext,
  ParentType extends ResolversParentTypes["UserCheckResult"] = ResolversParentTypes["UserCheckResult"]
> = {
  user?: Resolver<Maybe<ResolversTypes["User"]>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes["UserCheckStatus"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<
  ContextType = CustomContext,
  ParentType extends ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"]
> = {
  addUser?: Resolver<
    ResolversTypes["User"],
    ParentType,
    ContextType,
    RequireFields<MutationAddUserArgs, "name" | "password">
  >;
  addMarking?: Resolver<
    ResolversTypes["Marking"],
    ParentType,
    ContextType,
    RequireFields<MutationAddMarkingArgs, "userName" | "marking">
  >;
};

export type MarkingResolvers<
  ContextType = CustomContext,
  ParentType extends ResolversParentTypes["Marking"] = ResolversParentTypes["Marking"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  date?: Resolver<ResolversTypes["Date"], ParentType, ContextType>;
  activities?: Resolver<
    Maybe<Array<ResolversTypes["String"]>>,
    ParentType,
    ContextType
  >;
  comment?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["Date"], any> {
  name: "Date";
}

export type Resolvers<ContextType = CustomContext> = {
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserCheckResult?: UserCheckResultResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Marking?: MarkingResolvers<ContextType>;
  Date?: GraphQLScalarType;
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = CustomContext> = Resolvers<ContextType>;
