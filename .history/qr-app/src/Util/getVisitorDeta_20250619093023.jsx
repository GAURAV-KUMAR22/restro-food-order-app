export default function groupVisitorData(visitorInfo) {
  const grouped = {};

  visitorInfo.forEach((entry) => {
    const dateObj = new Date(entry.visitedAt);
    const dateKey = dateObj.toISOString().split("T")[0]; // "2025-06-18"
    const label = dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }); // "Jun 18"

    if (!grouped[dateKey]) {
      grouped[dateKey] = {
        date: label,
        visitorsSet: new Set(),
        views: 0,
      };
    }

    grouped[dateKey].visitorsSet.add(entry.ip); // track unique IPs
    grouped[dateKey].views += 1;
  });

  // Convert to chart-friendly format
  const result = Object.values(grouped).map((item) => ({
    date: item.date,
    visitors: item.visitorsSet.size,
    views: item.views,
  }));

  return result;
}
