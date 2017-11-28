import { ObjectId } from 'mongodb';

export function buildSearch({ OR = [], description_contains, url_contains }) {
  const filter = description_contains || url_contains ? {} : null;
  if (description_contains) {
    filter.description = { $regex: `.*${description_contains}.*` };
  }
  if (url_contains) {
    filter.url = { $regex: `.*${url_contains}.*` };
  }

  let filters = filter ? [filter] : [];
  for (let i = 0; i < OR.length; i++) {
    filters = filters.concat(buildSearch(OR[i]));
  }
  return filters;
}

export const buildFollowingFilter = following =>
  following.map(id => new ObjectId(id));

export const buildFilters = (filter, user) => {
  switch (filter) {
  case 'FOLLOWING':
    return {
      ownersIds: { $in: buildFollowingFilter(user.following) }
    };
  case 'nearby':
    return {};

  default:
    return {
      ownersIds: { $in: buildFollowingFilter(user.following) }
    };
  }
};
