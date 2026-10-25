import { createServerFn } from "@tanstack/react-start";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { requireAdminSession } from "./admin-auth.server";

export type TrafficSummary = {
  configured: boolean;
  totalUsers: number;
  pageViews: number;
  daily: { date: string; pageViews: number }[];
};

let client: BetaAnalyticsDataClient | undefined;

function getClient() {
  if (client) return client;
  const client_email = process.env["GA_CLIENT_EMAIL"];
  const private_key = process.env["GA_PRIVATE_KEY"]?.replace(/\\n/g, "\n");
  if (!client_email || !private_key) return undefined;
  client = new BetaAnalyticsDataClient({ credentials: { client_email, private_key } });
  return client;
}

export const getTrafficSummary = createServerFn({ method: "GET" }).handler(async (): Promise<TrafficSummary> => {
  await requireAdminSession();
  const rawPropertyId = process.env["GA_PROPERTY_ID"];
  const analytics = getClient();
  if (!analytics || !rawPropertyId) {
    return { configured: false, totalUsers: 0, pageViews: 0, daily: [] };
  }
  const propertyId = rawPropertyId.startsWith("properties/") ? rawPropertyId : `properties/${rawPropertyId}`;

  const dateRanges = [{ startDate: "27daysAgo", endDate: "today" }];
  const [totals] = await analytics.runReport({
    property: propertyId,
    dateRanges,
    metrics: [{ name: "screenPageViews" }, { name: "totalUsers" }],
  });
  const [daily] = await analytics.runReport({
    property: propertyId,
    dateRanges,
    dimensions: [{ name: "date" }],
    metrics: [{ name: "screenPageViews" }],
    orderBys: [{ dimension: { dimensionName: "date" } }],
  });

  const totalsRow = totals.rows?.[0];
  const pageViews = Number(totalsRow?.metricValues?.[0]?.value ?? 0);
  const totalUsers = Number(totalsRow?.metricValues?.[1]?.value ?? 0);

  return {
    configured: true,
    totalUsers,
    pageViews,
    daily: (daily.rows ?? []).map((row) => ({
      date: row.dimensionValues?.[0]?.value ?? "",
      pageViews: Number(row.metricValues?.[0]?.value ?? 0),
    })),
  };
});
