import type { RoiVideoData } from '../roi-schema';

export const JESSE_BROWN: RoiVideoData = {
  client: {
    firstName: 'Jesse',
    company: 'Sagemont Advisors',
    industry: 'Private Equity',
  },

  baseline: {
    label: 'Traditional Agency',
    costPerMonth: 3000,
    replyRate: 0.025,
    channels: 'email only',
    speedDays: '3-5 days',
    personalization: 'generic templates',
    avgDealValue: 75000,
  },

  gtme: {
    replyRate: 0.10,
    channels: 'email + LinkedIn',
    speed: 'same day',
    personalization: 'AI-personalized',
  },

  leads: {
    annual: 400,
    source: 'conference leads',
  },

  funnel: {
    replyToMeeting: 0.30,
    meetingToClose: 0.33,
  },

  cta: {
    line: "Jesse, here's what your numbers could look like.",
    subtitle: 'same leads. same conferences. different system.',
  },
};
