# A.I. Powered Calendar

This application renders a calendar which can be interacted with using a prompt. Having the commands submitted processed by a LLM provider (in this case Open AI), the input will be translated into actions to be applied to the calendar (i.e. adding events).

## Running the project locally

### Live Mode

Use live mode to hook up to the Open AI API.

1. Create an `.env.local` file in the root directory with the following variables:
```
# as per https://platform.openai.com/docs/models
# e.g. gpt-4
NEXT_PUBLIC_OPENAI_MODEL=...

# Your Open AI API key
NEXT_PUBLIC_OPENAI_API_KEY=...

# optional, as per https://platform.openai.com/docs/models/default-usage-policies-by-endpoint
# e.g. https://api.openai.com/v1/chat/completions
NEXT_PUBLIC_OPENAI_ENDPOINT=...
```
2. Install dependencies and start the development server:
```bash
npm i
npm run dev
```
3. Open [http://localhost:3000](http://localhost:3000).

Trigger actions by submitting commands using the input, i.e.: `There will be a company party this Friday in the office.`

### Demo Mode

Use demo mode to hook up to for testing the interface without hooking up to the Open AI API.

1. Create an `.env.local` file in the root directory with the following variable:
```
NEXT_PUBLIC_MODE=demo
```
2. Install dependencies and start the development server:
```bash
npm i
npm run dev
```
3. Open [http://localhost:3000](http://localhost:3000).

The top-level keys of the JSON object in the `demo.json` file in the root directory may be used to trigger actions, i.e. entering `add event` into the calendar prompt.

## Current features

### Add calendar events

Example:
```
There will be a company party this Friday in the office.
```

### Remove calendar events

Example:
```
I need to cancel going to the company party this Friday in the office.
```
