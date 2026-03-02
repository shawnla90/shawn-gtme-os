---
name: draft-email
description: Draft a client email from the current session context and push it to Lead Alchemy Gmail drafts. Use when the user says /draft-email, "email steve", "send an update to [name]", or "draft an email".
---

# Draft Email

Quickly draft a professional email from current session context and push it to the Lead Alchemy Gmail drafts folder.

## When to Invoke

- User says `/draft-email`, "draft an email", "email [name]", "send [name] an update"
- After completing deliverable work for a client
- When the user wants to communicate results to someone

## Args Format

`/draft-email [first_name] [email_address (optional)]`

Examples:
- `/draft-email Steve` - drafts to Steve, no To address prefilled
- `/draft-email Steve steve@legacy.com` - drafts with To prefilled
- `/draft-email` - asks who the email is for

## Email Style

### Subject Line
- Always: `Hey [First Name], [BLUF summary]`
- BLUF = Bottom Line Up Front. Lead with the result.
- Examples:
  - `Hey Steve, your enriched contact list is ready - 296 verified emails across 108 companies`
  - `Hey Mike, landing page is live at thegtmos.ai/for/acme`
  - `Hey Sarah, bug fix deployed - dashboard loads in <2s now`
- Keep under 80 chars. No fluff words (just, quick, wanted to).

### Body Format
1. **Opening line** - One sentence, the deliverable or result. No "hope this finds you well" garbage.
2. **The numbers / key facts** - Bulleted or short paragraphs. Concrete data. What they're getting.
3. **What they need to do** - Numbered steps if applicable. Clear next actions on their end.
4. **What's included / what's in the data** - Brief description of deliverable contents.
5. **Sign-off** - "Let me know if you need anything adjusted." + "Shawn"

### Voice Rules
- Lowercase energy. No corporate speak.
- Substance over polish. Lead with data and results.
- No em dashes. Use " - " (spaced hyphen) instead.
- No emojis unless the client uses them.
- Short paragraphs. White space between sections.
- Write like you're texting a smart colleague, not drafting a press release.

## How to Draft

1. **Gather context from the current session** - What was built, delivered, or completed? What are the key metrics? What files were created?
2. **Identify the recipient** - From the args or ask.
3. **Write the email** following the style rules above.
4. **Show the draft to the user** for review before pushing.
5. **Push to Gmail** using the Lead Alchemy API.

## Gmail API Integration

```python
import json, base64
from email.mime.text import MIMEText
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

TOKEN_PATH = '~/.google_workspace_mcp/credentials/token_shawn@leadalchemy.co.json'

with open(os.path.expanduser(TOKEN_PATH)) as f:
    token_data = json.load(f)

creds = Credentials(
    token=token_data['token'],
    refresh_token=token_data['refresh_token'],
    token_uri=token_data['token_uri'],
    client_id=token_data['client_id'],
    client_secret=token_data['client_secret'],
    scopes=token_data['scopes'],
)

service = build('gmail', 'v1', credentials=creds)

message = MIMEText(body)
message['to'] = recipient_email  # leave blank if unknown
message['subject'] = subject

raw = base64.urlsafe_b64encode(message.as_bytes()).decode()
draft = service.users().drafts().create(
    userId='me',
    body={'message': {'raw': raw}}
).execute()
```

## Rules

1. **Always show the draft** to the user before pushing to Gmail. Never push without review.
2. **Pull context from the session** - don't ask the user to repeat what was done. You were there.
3. **BLUF or die** - the subject line and first sentence must contain the key result.
4. **No attachment handling yet** - if the user wants to attach files, note that they'll need to add attachments manually in Gmail.
5. **Default sign-off is "Shawn"** unless the user specifies otherwise.
6. **If token is expired**, re-auth using the flow in `~/.google_workspace_mcp/credentials/` (see memory/infrastructure.md).
