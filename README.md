# 📅🤖 A.I. Powered Calendar

This experimental application renders a calendar which can be interacted with using a prompt. Having the natural language commands processed by an LLM service (in this case either Google Gemini or Open AI), the input will be translated into actions to be applied to the calendar (i.e. adding events).

Note this application being purely experimental, hence considered unstable.

## Running the project locally

The project can be configured to interface to either Google Gemini or OpenAI. Also, an offline "demo" mode can be set up allowing just specific interaction commands for testing purposes.

1. Create a `.env.local` file in the root directory with the following variables:
```
# May be demo, gemini or openai
NEXT_PUBLIC_MODE=...

### For using Gemini ###

# Your Gemini API key
NEXT_PUBLIC_GEMINI_API_KEY=...

# The Gemini model as per https://ai.google.dev/gemini-api/docs/models/gemini
NEXT_PUBLIC_GEMINI_MODEL=gemini-1.5-flash

### For using OpenAI ###

# Your OpenAI API key
NEXT_PUBLIC_OPENAI_API_KEY=...

# The OpenAI model as per https://platform.openai.com/docs/models
NEXT_PUBLIC_OPENAI_MODEL=gpt-4

# (optional) As per https://platform.openai.com/docs/models/default-usage-policies-by-endpoint
NEXT_PUBLIC_OPENAI_ENDPOINT=https://api.openai.com/v1/chat/completions
```
2. Install dependencies and start the development server:
```bash
npm i
npm run dev
```
3. Open [http://localhost:3000](http://localhost:3000).

Trigger actions by submitting commands using the input, i.e.: `There will be a company party upcoming Friday in the office.`

## Demo Mode

Use demo mode by setting `NEXT_PUBLIC_MODE=demo` in `.env.local` for testing the user interface without hooking up to an API.

The top-level keys of the JSON object in the `demo.json` file in the root directory may be used to trigger actions, i.e. entering `add event` into the calendar prompt.

## Notes on the implementation

The OpenAI interface is implemented using [TypeChat](https://github.com/microsoft/TypeChat). This interface is very reliable and JSON responses have a better quality than Gemini.

The Gemini interface is implemented in the form of a custom prompt generator submitting requests per the generic [Google AI SDK](https://github.com/google-gemini/generative-ai-js). However, no matter how precise the instructions, Gemini seems to have problems processing instructions related to JSON objects, e.g. picking an event object from a given array and returning that exact object. Therefore, at the time of writing, Gemini results are considerably less reliable.

## Current features

### Add calendar events

Example:
```
There will be a company party upcoming Friday in the office from 16:00 to 20:00.
```

### Remove calendar events

Example:
```
I need to cancel going to the company party this Friday.
```

### Find calendar events

Will navigate to the month the event is taking place in.

Example:
```
When is the company party taking place?.
```
