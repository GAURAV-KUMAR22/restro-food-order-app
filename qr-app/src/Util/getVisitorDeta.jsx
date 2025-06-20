export const groupVisitorData = (aggregatedInfo) => {
  const dateObj = new Date(aggregatedInfo.lastVisit);
  const label = dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const result = [
    {
      date: label,
      visitors: aggregatedInfo.totalUniqueVisitors,
      views: aggregatedInfo.totalVisits,
    },
  ];

  return result;
};
