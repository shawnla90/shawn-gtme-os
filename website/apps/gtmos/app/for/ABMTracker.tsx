'use client'

import { useSearchParams } from 'next/navigation'
import Script from 'next/script'

interface ABMTrackerProps {
  slug: string
  company: string
  contactName?: string
}

export function ABMTracker({ slug, company, contactName }: ABMTrackerProps) {
  const searchParams = useSearchParams()
  const contactParam = searchParams.get('c')
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

  if (!posthogKey) return null

  return (
    <Script
      id="posthog-abm"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onFeatureFlags onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
          posthog.init('${posthogKey}', {
            api_host: '${posthogHost}',
            person_profiles: 'identified_only',
          });
          posthog.capture('abm_page_viewed', {
            company_slug: '${slug}',
            company_name: '${company}',
            ${contactName ? `contact_name: '${contactName}',` : ''}
            contact_id: '${contactParam || 'default'}',
            depersonalized: ${!contactName},
          });
        `,
      }}
    />
  )
}
