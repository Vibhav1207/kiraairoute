# KiraAI Route

Open-source local gateway for using Kira AI with OpenAI-compatible clients.

## Quick Start

Run:

```bash
npx kiraairoute
```

On first launch, KiraAI Route asks for your Kira API key and saves it locally.

After setup, the local API is available at:

```text
http://127.0.0.1:4010/v1
```

## Features

- OpenAI-compatible `/v1/chat/completions`
- OpenAI-compatible `/v1/responses`
- Local API gateway
- Kira API key stored locally
- Works with OpenAI-compatible clients
- Designed for Codex and other AI tools
- No need to manually set the API key every time

## Supported Free Models

Kira currently provides free daily token allowances for selected models.

| Model | Model ID |
|---|---|
| Kira Mini 1.0 | `kira-mini-1.0` |
| Tencent Hy3 Free | `hy3` |
| Mimo V2.5 | `mimo-v2.5` |
| Kira Mini 2.0 | `kira-2.0` |

Availability and limits are determined by Kira AI and may change.

## API

### Chat Completions

```bash
curl http://127.0.0.1:4010/v1/chat/completions ^
  -H "Authorization: Bearer YOUR_KIRA_API_KEY" ^
  -H "Content-Type: application/json" ^
  -d "{\"model\":\"kira-mini-1.0\",\"messages\":[{\"role\":\"user\",\"content\":\"Hello!\"}]}"
```

### Responses API

```bash
curl http://127.0.0.1:4010/v1/responses ^
  -H "Authorization: Bearer YOUR_KIRA_API_KEY" ^
  -H "Content-Type: application/json" ^
  -d "{\"model\":\"kira-mini-1.0\",\"input\":\"Hello!\"}"
```

## Models

List available models:

```bash
curl http://127.0.0.1:4010/v1/models
```

## Codex

KiraAI Route provides a local OpenAI-compatible endpoint:

```text
http://127.0.0.1:4010/v1
```

You can configure compatible clients to use this endpoint and select:

```text
kira-mini-1.0
```

## Configuration

On first launch, KiraAI Route asks for your Kira API key.

The key is stored locally at:

```text
~/.kiraairoute/config.json
```

You can also provide the key through an environment variable:

```text
KIRA_API_KEY=your_kira_api_key
```

The environment variable takes priority over the saved configuration.

## Development

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY
cd kiraairoute
```

Install dependencies:

```bash
npm install
```

Build:

```bash
npm run build
```

Start:

```bash
npm start
```

Development mode:

```bash
npm run dev
```

## Project Structure

```text
kiraairoute/
├── src/
│   ├── cli/
│   │   ├── cli.ts
│   │   ├── config.ts
│   │   └── ui.ts
│   ├── server/
│   │   ├── server.ts
│   │   ├── routes.ts
│   │   └── middleware.ts
│   ├── kira/
│   │   ├── client.ts
│   │   └── models.ts
│   ├── protocols/
│   │   ├── responses.ts
│   │   └── chat.ts
│   ├── config/
│   │   └── constants.ts
│   └── index.ts
├── dist/
├── README.md
├── package.json
├── tsconfig.json
├── .gitignore
└── LICENSE
```

## Security

Never commit your Kira API key to GitHub.

Do not put real API keys in:

- Source code
- README files
- `.env` files committed to Git
- Screenshots
- GitHub issues

## License

MIT