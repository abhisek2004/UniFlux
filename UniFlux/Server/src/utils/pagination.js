// Pagination Helper Utility
export const getPagination = (page = 1, limit = 10) => {
  const parsedPage = parseInt(page) || 1;
  const parsedLimit = parseInt(limit) || 10;
  const skip = (parsedPage - 1) * parsedLimit;

  return {
    page: parsedPage,
    limit: parsedLimit,
    skip,
  };
};

export const getPaginationMeta = (total, page, limit) => {
  return {
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    limit: parseInt(limit),
  };
};
