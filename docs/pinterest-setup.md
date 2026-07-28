# Pinterest API Setup

You'll need a Pinterest **business** account and a registered developer app before the
workflow can post pins on your behalf. Personal accounts can be converted to business
accounts for free in Pinterest settings.

## 1. Create a Pinterest developer app

1. Go to https://developers.pinterest.com/ and log in with your Pinterest business account.
2. Create a new app (choose "Standard" access, not "Trial", if you want production rate limits).
3. Note down the **App ID (Client ID)** and **App secret (Client Secret)**.
4. Under the app's settings, add a **Redirect URI**. If you're generating the token by hand
   (recommended for a single-account automation like this), you can use
   `https://developers.pinterest.com/apps/` or any HTTPS URL you control — you only need to be
   able to read the `code` query parameter it redirects to.

## 2. Authorize the app and get an access token

Pinterest uses standard OAuth2 Authorization Code flow.

1. Send yourself (browser) to:
   ```
   https://www.pinterest.com/oauth/?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=boards:read,pins:read,pins:write,user_accounts:basic_read
   ```
2. Approve the app. Pinterest redirects to your redirect URI with `?code=...` — copy that code.
3. Exchange the code for tokens:
   ```bash
   curl -X POST https://api.pinterest.com/v5/oauth/token \
     -u "YOUR_CLIENT_ID:YOUR_CLIENT_SECRET" \
     -d "grant_type=authorization_code" \
     -d "code=THE_CODE_FROM_STEP_2" \
     -d "redirect_uri=YOUR_REDIRECT_URI"
   ```
4. The response contains `access_token` and `refresh_token`. Pinterest access tokens expire
   (currently ~1 hour for trial apps, up to 30 days for standard apps), which is why the n8n
   credential below is configured as OAuth2 rather than a static bearer token — n8n will
   refresh it automatically.

## 3. Find your board ID

```bash
curl https://api.pinterest.com/v5/boards \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

Copy the `id` of the board you want the agent to post to, and paste it into the workflow's
**Pin Config** node (`board_id` field).

## 4. Create the n8n credential

In n8n: **Credentials → New → OAuth2 API** (generic), then configure:

| Field | Value |
|---|---|
| Grant Type | Authorization Code |
| Authorization URL | `https://www.pinterest.com/oauth/` |
| Access Token URL | `https://api.pinterest.com/v5/oauth/token` |
| Client ID | your App ID |
| Client Secret | your App secret |
| Scope | `boards:read,pins:read,pins:write,user_accounts:basic_read` |
| Authentication | **Header** (Pinterest requires Basic auth on the token endpoint, not body params) |

Name the credential **"Pinterest OAuth2 account"** and assign it to the **Create Pinterest
Pin** node (open the node → Credential dropdown). n8n's redirect URI, shown in the
credential screen, is what you should actually register as the app's Redirect URI in step 1
if you let n8n drive the OAuth flow (click "Connect my account" in the credential UI) — this
is easier than the manual curl flow above and is the recommended path.

## Rate limits & platform policy

- Standard Pinterest apps are limited to **1,000 pin creates per app per day** (check current
  limits at https://developers.pinterest.com/docs/reference/rate-limits/ since Pinterest
  updates these).
- Pinterest's Developer Guidelines prohibit spammy, low-quality, or repetitive automated
  content. Keep posting frequency reasonable (the default workflow posts once/day) and make
  sure generated images/captions are genuinely useful — accounts that look like pure spam
  bots risk suspension.
