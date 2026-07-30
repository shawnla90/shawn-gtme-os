// {{youtube:VIDEO_ID}} on its own line in a blog markdown file becomes a
// privacy-friendly lite embed: the iframe srcdoc shows just the thumbnail +
// play button; the real player only loads when clicked. Pure HTML, no JS.
const SHORTCODE = /<p>\s*(?:\{|&#123;){2}youtube:([A-Za-z0-9_-]{6,})(?:\}|&#125;){2}\s*<\/p>/g

function liteEmbed(id: string): string {
  const embed = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`
  const thumb = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
  const srcdoc = `<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}img{height:100%;object-fit:cover}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}</style><a href="${embed}"><img src="${thumb}" alt="Play video"><span>&#9654;</span></a>`
  return (
    `<div class="yt-embed">` +
    `<iframe loading="lazy" src="${embed.replace('?autoplay=1', '')}" ` +
    `srcdoc='${srcdoc}' title="YouTube video" ` +
    `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ` +
    `allowfullscreen></iframe></div>`
  )
}

export function withYouTubeEmbeds(html: string): string {
  return html.replace(SHORTCODE, (_m, id: string) => liteEmbed(id))
}

// {{video:https://...mp4}} on its own line becomes a self-hosted HTML5 player.
// Runs after sanitize (like the YouTube shortcode), so the <video> tag survives.
// GFM autolinks the URL inside the braces and even swallows the closing }} into
// the href (as %7D%7D), so this parses the whole paragraph and cleans the URL.
const VIDEO_SHORTCODE = /<p>\s*(?:\{|&#123;){2}video:([\s\S]*?)<\/p>/g

const stripBraces = (s: string) => s.replace(/(?:%7D|&#125;|\})+$/i, '').trim()

export function withVideoEmbeds(html: string): string {
  return html.replace(VIDEO_SHORTCODE, (m, inner: string) => {
    // Autolinked anchors reduce to their text, which is the URL itself.
    const text = inner.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    const [rawUrl, rawPoster] = text.split(/\s+poster=/)
    const url = stripBraces(rawUrl ?? '')
    const poster = rawPoster ? stripBraces(rawPoster) : ''
    if (!/^https:\/\/[^\s"']+\.(mp4|webm)$/i.test(url)) return m
    const posterAttr = /^https:\/\/[^\s"']+\.(jpg|jpeg|png|webp)$/i.test(poster)
      ? ` poster="${poster}"`
      : ''
    return (
      `<div class="video-embed" style="display:flex;justify-content:center;margin:2rem 0">` +
      `<video controls playsinline preload="metadata"${posterAttr} ` +
      `style="max-height:640px;max-width:100%;border-radius:12px;background:#000" ` +
      `src="${url}"></video></div>`
    )
  })
}
