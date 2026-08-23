type ExpertisePage = {
  slug: string;
  fr: string;
  title: string;
  metaTitle: string;
  h1: string;
  description: string;
  quick: string;
  services: string[];
  sections: Array<{
    title: string;
    paragraphs?: string[];
    bullets?: string[];
  }>;
  faq: Array<{
    question: string;
    answer: string;
  }>;
};

type ServiceSeed = Omit<ExpertisePage, 'sections'> & {
  context: string;
  approach: string[];
};

const makeServicePage = (seed: ServiceSeed): ExpertisePage => ({
  ...seed,
  sections: [
    {
      title: 'What this service solves',
      paragraphs: [seed.context],
    },
    {
      title: 'Richmedia approach',
      bullets: seed.approach,
    },
  ],
});

export const enServiceLandingPages: ExpertisePage[] = [
  makeServicePage({
    slug: 'google-ads-morocco',
    fr: '/expertises/google-ads-maroc',
    title: 'Google Ads Morocco',
    metaTitle: 'Google Ads Agency in Morocco | Richmedia',
    h1: 'Google Ads agency in Morocco',
    description:
      'Richmedia manages Google Ads campaigns in Morocco across Search, Performance Max, YouTube, tracking and conversion journeys.',
    quick:
      'A Google Ads agency in Morocco helps brands capture active search intent, structure campaigns, control budget and measure leads or sales with reliable tracking. Richmedia connects media buying, landing pages and reporting from Casablanca.',
    services: ['Search campaigns', 'Performance Max', 'Landing page alignment', 'Conversion tracking', 'Budget pacing'],
    context:
      'Google Ads works best when campaigns are connected to clear intent: searches for a service, a product, a location or a price. For Moroccan brands, this often means separating local queries, Arabic and French wording, brand demand, competitor demand and commercial keywords.',
    approach: [
      'Map search intent and build campaign architecture around business value.',
      'Align ads, extensions, landing pages and conversion tracking.',
      'Optimize budget based on cost, quality and follow-up signals.',
    ],
    faq: [
      {
        question: 'Is Google Ads useful for lead generation in Morocco?',
        answer:
          'Yes, especially when people already search for the offer. Google Ads captures expressed demand, but performance depends on keyword quality, landing pages, tracking and commercial follow-up.',
      },
      {
        question: 'Does Richmedia manage Search and Performance Max?',
        answer:
          'Yes. Richmedia can manage Search, Performance Max, YouTube and remarketing when they fit the objective. The media plan defines each format role before budget is allocated.',
      },
    ],
  }),
  makeServicePage({
    slug: 'meta-ads-morocco',
    fr: '/expertises/meta-ads-maroc',
    title: 'Meta Ads Morocco',
    metaTitle: 'Meta Ads Agency in Morocco | Richmedia',
    h1: 'Meta Ads agency in Morocco',
    description:
      'Richmedia manages Facebook and Instagram campaigns in Morocco with creative testing, audiences, Pixel, CAPI, lead forms and CRM follow-up.',
    quick:
      'A Meta Ads agency in Morocco helps brands generate demand and leads on Facebook and Instagram through strong creative, audience testing, tracking and conversion follow-up. Richmedia links campaigns to landing pages, WhatsApp and CRM workflows.',
    services: ['Facebook Ads', 'Instagram Ads', 'Creative testing', 'Pixel and CAPI', 'Lead generation'],
    context:
      'Meta performance is not only a media setting. Strong gains usually come from sharper angles, hooks, formats and proof. Campaigns must separate discovery, retargeting and conversion so the budget does not mix incompatible objectives.',
    approach: [
      'Build campaign structure by objective and audience maturity.',
      'Test creative concepts before scaling spend.',
      'Connect Pixel, CAPI, forms, landing pages and CRM follow-up.',
    ],
    faq: [
      {
        question: 'Should I use Lead Ads or landing pages?',
        answer:
          'Lead Ads are useful for volume and low friction. Landing pages are better when the offer needs explanation, proof or qualification. The right choice depends on the value of the lead.',
      },
      {
        question: 'Can Meta Ads work for B2B in Morocco?',
        answer:
          'Yes, but B2B campaigns need sharper targeting, stronger proof and a clear follow-up process. Meta can create demand, while Google, LinkedIn or CRM may complete the conversion path.',
      },
    ],
  }),
  makeServicePage({
    slug: 'lead-generation-morocco',
    fr: '/expertises/generation-leads-maroc',
    title: 'Lead Generation Morocco',
    metaTitle: 'Lead Generation Agency Morocco | Richmedia',
    h1: 'Lead generation agency in Morocco',
    description:
      'Richmedia builds lead generation systems in Morocco combining media, landing pages, WhatsApp, CRM, tracking and qualification rules.',
    quick:
      'Lead generation in Morocco requires more than traffic. A strong system connects media, landing pages, forms, WhatsApp, CRM and follow-up rules so leads are qualified, measured and useful for sales teams.',
    services: ['Acquisition funnel', 'Landing pages', 'WhatsApp follow-up', 'CRM routing', 'Lead quality reporting'],
    context:
      'A lead is only useful when it can be followed. We start from the sales process: who receives the lead, how quickly, with which information and which qualification rules. The media plan comes after that framing.',
    approach: [
      'Connect paid media, SEO pages, landing pages and forms.',
      'Track WhatsApp clicks, calls, CRM fields and lead status.',
      'Separate lead volume from commercial quality in reporting.',
    ],
    faq: [
      {
        question: 'What is a qualified lead?',
        answer:
          'A qualified lead matches the target, shows a real need and contains enough information for the sales team to act. Qualification can depend on budget, location, timing, sector or product interest.',
      },
      {
        question: 'How do you reduce poor quality leads?',
        answer:
          'We adjust targeting, messages, form fields, landing pages and follow-up rules. Sometimes adding one qualification question reduces volume but improves the quality of conversations.',
      },
    ],
  }),
  makeServicePage({
    slug: 'social-media-morocco',
    fr: '/expertises/social-media-maroc',
    title: 'Social Media Morocco',
    metaTitle: 'Social Media Agency Morocco | Richmedia',
    h1: 'Social media agency in Morocco',
    description:
      'Richmedia supports social media strategy in Morocco: editorial planning, content production, community management, performance amplification and reporting.',
    quick:
      'A social media agency in Morocco helps brands define their editorial role, create useful content, manage communities and connect social presence to measurable business goals, from awareness to leads and sales.',
    services: ['Editorial strategy', 'Content production', 'Community management', 'Social reporting', 'Paid amplification'],
    context:
      'Posting more is rarely the answer. Social channels need a clear role: build memory, educate, reassure, recruit, convert or support a campaign. Each channel gets a rhythm and proof points that fit the audience.',
    approach: [
      'Define the role of each social platform.',
      'Produce social-first photo, video and short-form formats.',
      'Measure content performance and amplify what proves useful.',
    ],
    faq: [
      {
        question: 'Which platforms should a Moroccan brand prioritize?',
        answer:
          'The choice depends on the audience and objective. Instagram and Facebook remain strong for reach, TikTok for native discovery, LinkedIn for B2B, and WhatsApp for conversion or follow-up.',
      },
      {
        question: 'Can social media generate leads?',
        answer:
          'Yes, when content is connected to a clear offer, landing page, form, WhatsApp flow or retargeting campaign. Organic content alone rarely creates a predictable acquisition system.',
      },
    ],
  }),
  makeServicePage({
    slug: 'tiktok-ads-morocco',
    fr: '/expertises/tiktok-ads-maroc',
    title: 'TikTok Ads Morocco',
    metaTitle: 'TikTok Ads Agency Morocco | Richmedia',
    h1: 'TikTok Ads agency in Morocco',
    description:
      'Richmedia manages TikTok Ads in Morocco with native creative, Spark Ads, UGC formats, audience testing, retargeting and performance tracking.',
    quick:
      'TikTok Ads in Morocco help brands test native short-form creative, reach discovery audiences and support acquisition when campaigns are built around strong hooks, creator-style formats and clear conversion paths.',
    services: ['TikTok strategy', 'Spark Ads', 'UGC concepts', 'Retargeting', 'Performance tracking'],
    context:
      'TikTok rewards native ideas more than polished advertising. The channel becomes useful when hooks, creator-style scripts and format variations are tested quickly and connected to a landing page or WhatsApp journey.',
    approach: [
      'Create native hooks and short-form concepts.',
      'Use Spark Ads and creator amplification when relevant.',
      'Build retargeting audiences from views, clicks and interactions.',
    ],
    faq: [
      {
        question: 'Is TikTok only for awareness?',
        answer:
          'No. TikTok is strong for awareness and discovery, but it can support acquisition when the creative is direct, the offer is clear and the landing or WhatsApp path is ready.',
      },
      {
        question: 'Do TikTok Ads need creators?',
        answer:
          'Not always, but creator-style content usually performs better than classic ads. The key is to make the message feel native to the platform while keeping business intent clear.',
      },
    ],
  }),
  makeServicePage({
    slug: 'whatsapp-marketing-morocco',
    fr: '/expertises/whatsapp-marketing-maroc',
    title: 'WhatsApp Marketing Morocco',
    metaTitle: 'WhatsApp Marketing Morocco | Richmedia',
    h1: 'WhatsApp marketing in Morocco',
    description:
      'Richmedia designs WhatsApp marketing systems in Morocco: opt-in capture, templates, campaigns, automation, CRM follow-up and reporting.',
    quick:
      'WhatsApp marketing in Morocco turns media, CRM and customer databases into conversational journeys using opt-in audiences, approved templates, segmentation, automation and follow-up rules that support conversion without losing control of consent.',
    services: ['Opt-in strategy', 'WhatsApp campaigns', 'Automation flows', 'CRM follow-up', 'Reporting'],
    context:
      'WhatsApp performs when the message is useful, timely and connected to an action: booking, confirmation, offer request, reminder or advisor handoff. The channel must remain permission-based and measurable.',
    approach: [
      'Prepare audiences, opt-in logic and templates.',
      'Sequence messages around customer intent and timing.',
      'Track reads, clicks, replies, opt-outs and conversions.',
    ],
    faq: [
      {
        question: 'Can WhatsApp replace email or SMS?',
        answer:
          'It can complement them, but it should not be treated as a generic blast channel. WhatsApp works best for useful, consent-based interactions with clear actions and follow-up.',
      },
      {
        question: 'Is WhatsApp marketing measurable?',
        answer:
          'Yes. Campaigns can track sends, reads, clicks, replies, opt-outs and conversions when links, CRM events and reporting rules are prepared before launch.',
      },
    ],
  }),
  makeServicePage({
    slug: 'crm-marketing-automation-morocco',
    fr: '/expertises/marketing-automation-crm-maroc',
    title: 'CRM & Marketing Automation Morocco',
    metaTitle: 'CRM & Marketing Automation Morocco | Richmedia',
    h1: 'CRM and marketing automation in Morocco',
    description:
      'Richmedia connects CRM, marketing automation, lead scoring, WhatsApp, email, dashboards and sales workflows for Moroccan brands.',
    quick:
      'CRM and marketing automation in Morocco help brands centralize contacts, qualify leads, trigger follow-ups and measure conversion across media, website, WhatsApp and sales teams without relying on manual coordination.',
    services: ['CRM architecture', 'Lead scoring', 'Automation workflows', 'WhatsApp and email journeys', 'Dashboards'],
    context:
      'Automation starts with process. Before choosing tools, we map the journey: source, qualification, routing, follow-up, status changes and sales feedback. This reduces delays, missed leads and unclear ownership.',
    approach: [
      'Define CRM fields, statuses and lifecycle stages.',
      'Build scoring, routing and follow-up triggers.',
      'Measure from first touch to opportunity and sale.',
    ],
    faq: [
      {
        question: 'Do we need a complex CRM to automate marketing?',
        answer:
          'Not necessarily. The first step is a clear data model and process. A simple CRM can work if fields, statuses, routing and follow-up rules are properly defined.',
      },
      {
        question: 'What should marketing automation measure?',
        answer:
          'It should measure lead source, qualification, contact rate, follow-up speed, conversion steps and sales outcomes. Media KPIs alone are not enough to evaluate commercial impact.',
      },
    ],
  }),
  makeServicePage({
    slug: 'influencer-marketing-morocco',
    fr: '/expertises/influence-marketing-maroc',
    title: 'Influencer Marketing Morocco',
    metaTitle: 'Influencer Marketing Morocco | Richmedia',
    h1: 'Influencer marketing in Morocco',
    description:
      'Richmedia structures influencer marketing in Morocco: creator selection, briefs, UGC, content rights, amplification and reporting.',
    quick:
      'Influencer marketing in Morocco helps brands borrow creator credibility, produce social-first content and reach communities through collaborations that are selected, briefed, measured and amplified according to the campaign objective.',
    services: ['Creator casting', 'Influence briefs', 'UGC production', 'Paid amplification', 'Performance reporting'],
    context:
      'The right creator is not only the biggest one. Audience fit, content quality, credibility, brand safety, engagement consistency and campaign role matter more than follower count alone.',
    approach: [
      'Build a creator shortlist with a clear rationale.',
      'Manage briefs, validation steps, rights and deliverables.',
      'Measure reach, engagement, clicks, saves or conversions.',
    ],
    faq: [
      {
        question: 'How do you choose influencers?',
        answer:
          'We combine audience fit, content relevance, credibility, consistency, brand safety and campaign objective. The choice should be justified by the role of the creator, not only follower count.',
      },
      {
        question: 'Can influencer content be reused in ads?',
        answer:
          'Yes, if usage rights are defined upfront. Creator content can feed Meta, TikTok or landing pages, but the contract must clarify duration, formats and amplification rights.',
      },
    ],
  }),
  makeServicePage({
    slug: 'social-listening-morocco',
    fr: '/expertises/social-listening-maroc',
    title: 'Social Listening Morocco',
    metaTitle: 'Social Listening Morocco | Richmedia',
    h1: 'Social listening in Morocco',
    description:
      'Richmedia helps brands in Morocco monitor conversations, reputation, competitors, creators, trends and weak signals for better decisions.',
    quick:
      'Social listening in Morocco tracks conversations, reputation, trends, competitors and audience signals across digital platforms so brands can understand what people say, detect risks and identify content or campaign opportunities.',
    services: ['Brand monitoring', 'Reputation alerts', 'Competitor watch', 'Trend detection', 'Insight reporting'],
    context:
      'Social listening gives teams a more precise view of questions, objections, vocabulary, complaints and opportunities. It is useful before campaigns, during launches and after major brand moments.',
    approach: [
      'Monitor brand, products, competitors and priority topics.',
      'Separate useful signals from dashboard noise.',
      'Turn findings into content, media or customer service actions.',
    ],
    faq: [
      {
        question: 'Is social listening only for large brands?',
        answer:
          'No. It is useful whenever online conversations influence demand, reputation or customer decisions. Smaller brands can start with focused monitoring around key products, competitors or topics.',
      },
      {
        question: 'What does a social listening report include?',
        answer:
          'It can include conversation themes, sentiment signals, recurring questions, competitor mentions, creator opportunities, risks and recommended actions for content, media or customer service.',
      },
    ],
  }),
  makeServicePage({
    slug: 'geofencing-drive-to-store-morocco',
    fr: '/expertises/geofencing-drive-to-store-maroc',
    title: 'Geofencing & Drive-to-Store Morocco',
    metaTitle: 'Geofencing Drive-to-Store Morocco | Richmedia',
    h1: 'Geofencing and drive-to-store in Morocco',
    description:
      'Richmedia designs geofencing and drive-to-store campaigns in Morocco for retail, automotive, events and local networks.',
    quick:
      'Geofencing and drive-to-store campaigns in Morocco use location logic, local audiences, mobile media and conversion paths to generate visits, appointments, coupon use or local demand around a physical place.',
    services: ['Local media planning', 'Geofenced audiences', 'Store visit journeys', 'Coupons and QR flows', 'Local reporting'],
    context:
      'Drive-to-store campaigns need more than a radius around a shop. The offer, timing, creative and action must match local behavior: visit, call, booking, coupon or WhatsApp contact.',
    approach: [
      'Define local audiences and location logic.',
      'Connect creative to visits, calls, bookings or coupons.',
      'Prepare reporting for local performance and offline actions.',
    ],
    faq: [
      {
        question: 'What can geofencing measure?',
        answer:
          'It can support local reach, clicks, visits, coupon use, calls, bookings or WhatsApp contacts depending on the tracking setup. Offline attribution must be defined carefully before launch.',
      },
      {
        question: 'Is drive-to-store only for retail?',
        answer:
          'No. It can be used for automotive, real estate, events, tourism, education or any business where a physical location or appointment matters in the conversion journey.',
      },
    ],
  }),
];
