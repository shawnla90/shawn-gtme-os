# Assets

## Agent Taxonomy

| Agent | Site | Avatar | Chat Component | Idle Asset |
|-------|------|--------|----------------|------------|
| Nio | shawnos.ai | /avatars/nio-idle.apng | NioChat.tsx | APNG animation |
| Recon | thegtmos.ai | /avatars/recon-idle.apng | ReconChat.tsx | APNG animation |
| Rem | thecontentos.ai | /avatars/rem-idle.apng | RemChat.tsx | APNG animation |

"Nio" = the chatbot avatar. Pixel sprites = "progression sprites" or "tier sprites."

## Primary Assets (chatbot avatars)
- website/apps/shawnos/public/avatars/nio-idle.apng
- website/apps/gtmos/public/avatars/recon-idle.apng
- website/apps/contentos/public/avatars/rem-idle.apng

## Legacy: Progression Sprites (RPG system)
Originals archived to _archive/progression-sprites/.
Serving copies remain at website/apps/shawnos/public/progression/avatars/ for RPG pages.
Code: rpg.ts getTierAvatarUrls(), getClassAvatarUrls(), getToolAvatarUrls()

## Naming Conventions
- Chatbot: {agent}-idle.apng
- Progression: tier-{N}-idle.gif, class-{name}-idle.gif, tool-{name}-idle.gif
- Sized variants: -{64,128,256,512}.gif
- Sprite sheets: -sheet-256.png
