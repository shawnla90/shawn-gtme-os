/** ROI Video data schema — all client-specific content in one file */

export interface RoiVideoData {
  client: {
    firstName: string;
    company: string;
    industry?: string;
  };

  baseline: {
    label: string;
    costPerMonth: number;
    replyRate: number;
    channels: string;
    speedDays: string;
    personalization: string;
    avgDealValue: number;
  };

  gtme: {
    replyRate: number;
    channels: string;
    speed: string;
    personalization: string;
  };

  leads: {
    annual: number;
    source: string;
  };

  funnel: {
    replyToMeeting: number;
    meetingToClose: number;
  };

  cta: {
    line: string;
    subtitle: string;
  };
}

/** Computed funnel metrics for one side of the comparison */
export interface FunnelResult {
  leads: number;
  replies: number;
  meetings: number;
  deals: number;
  revenue: number;
}

/** Compute funnel math from schema data */
export function computeRoiFunnel(data: RoiVideoData): {
  baseline: FunnelResult;
  gtme: FunnelResult;
  delta: {
    revenue: number;
    replyPctIncrease: number;
    extraDeals: number;
    extraMeetings: number;
  };
  annualAgencyCost: number;
} {
  const leads = data.leads.annual;

  // Baseline funnel
  const bReplies = Math.round(leads * data.baseline.replyRate);
  const bMeetings = Math.round(bReplies * data.funnel.replyToMeeting);
  const bDeals = Math.round(bMeetings * data.funnel.meetingToClose);
  const bRevenue = bDeals * data.baseline.avgDealValue;

  // GTMe funnel
  const gReplies = Math.round(leads * data.gtme.replyRate);
  const gMeetings = Math.round(gReplies * data.funnel.replyToMeeting);
  const gDeals = Math.round(gMeetings * data.funnel.meetingToClose);
  const gRevenue = gDeals * data.baseline.avgDealValue;

  const replyPctIncrease = Math.round(
    ((data.gtme.replyRate - data.baseline.replyRate) / data.baseline.replyRate) * 100,
  );

  return {
    baseline: { leads, replies: bReplies, meetings: bMeetings, deals: bDeals, revenue: bRevenue },
    gtme: { leads, replies: gReplies, meetings: gMeetings, deals: gDeals, revenue: gRevenue },
    delta: {
      revenue: gRevenue - bRevenue,
      replyPctIncrease,
      extraDeals: gDeals - bDeals,
      extraMeetings: gMeetings - bMeetings,
    },
    annualAgencyCost: data.baseline.costPerMonth * 12,
  };
}
