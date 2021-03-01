import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from "graphql";
import * as Types from "./user";

import { CustomContext } from "./customContext";

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
  ID: ResolverTypeWrapper<Types.Scalars["ID"]>;
  String: ResolverTypeWrapper<Types.Scalars["String"]>;
  User: ResolverTypeWrapper<Types.User>;
  Boolean: ResolverTypeWrapper<Types.Scalars["Boolean"]>;
  UserCheckResult: ResolverTypeWrapper<Types.UserCheckResult>;
  Mutation: ResolverTypeWrapper<{}>;
  MarkingInput: Types.MarkingInput;
  Marking: ResolverTypeWrapper<Types.Marking>;
  UserCheckStatus: Types.UserCheckStatus;
  Date: ResolverTypeWrapper<Types.Scalars["Date"]>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {};
  ID: Types.Scalars["ID"];
  String: Types.Scalars["String"];
  User: Types.User;
  Boolean: Types.Scalars["Boolean"];
  UserCheckResult: Types.UserCheckResult;
  Mutation: {};
  MarkingInput: Types.MarkingInput;
  Marking: Types.Marking;
  Date: Types.Scalars["Date"];
};

export type QueryResolvers<
  ContextType = CustomContext,
  ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"]
> = {
  getUser?: Resolver<
    ResolversTypes["User"],
    ParentType,
    ContextType,
    RequireFields<Types.QueryGetUserArgs, "name">
  >;
  getUsers?: Resolver<
    Types.Maybe<Array<ResolversTypes["User"]>>,
    ParentType,
    ContextType
  >;
  checkUser?: Resolver<
    ResolversTypes["UserCheckResult"],
    ParentType,
    ContextType,
    RequireFields<Types.QueryCheckUserArgs, "name" | "password">
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
  user?: Resolver<Types.Maybe<ResolversTypes["User"]>, ParentType, ContextType>;
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
    RequireFields<Types.MutationAddUserArgs, "name" | "password">
  >;
  addMarking?: Resolver<
    ResolversTypes["Marking"],
    ParentType,
    ContextType,
    RequireFields<Types.MutationAddMarkingArgs, "userName">
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
};

export type MarkingResolvers<
  ContextType = CustomContext,
  ParentType extends ResolversParentTypes["Marking"] = ResolversParentTypes["Marking"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  date?: Resolver<ResolversTypes["Date"], ParentType, ContextType>;
  comment?: Resolver<
    Types.Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
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
