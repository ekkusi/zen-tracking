type OrFilter<FilterType> =
  | FilterType
  | {
      is_private: boolean;
    }
  | undefined;

type NotPrivateOrCurrentUserFilter<AdditionalFiltersType = {}> = {
  AND: AdditionalFiltersType & {
    OR: OrFilter<AdditionalFiltersType>[];
  };
};

/*
Generic Filter mapper for filtering out fields that are not private OR not created by currentuser.
Usage depends of the record that you want to filter. For example, filtering challenges would go like:

SharedMapper.notPrivateFilterMapper<Prisma.ChallengeWhereInput>(
  { id },
  { creator_name: currentUserName }
);

This would filter by id and so, that challenge is not private OR challenges field creator_name == currentUserName

*/
export class SharedMapper {
  public static notPrivateFilterMapper<FiltersType>(
    otherFilters: FiltersType,
    ownerUserFilter?: FiltersType
  ): NotPrivateOrCurrentUserFilter<FiltersType> {
    const filters = {
      AND: {
        ...otherFilters,
        OR: [
          {
            is_private: false,
          },
          ownerUserFilter
            ? {
                ...ownerUserFilter,
              }
            : undefined,
        ],
      },
    };
    console.log(
      `notPrivateFilterMapper mapped filters: ${JSON.stringify(filters)}`
    );
    return filters;
  }
}
