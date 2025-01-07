## FC TRENDS FINDER 

- FC Trends Finder is a farcaster autonomous agent that finds trends and publish a report in the farcaster social network.

### Are you not entertained? 

- Select your favorite sources of interesting content in the `src/lib/getInterestingContent.tsx` file.
- Interesting Content Sources format:
```
{ id: string; type: string }
{ id: "3", type: "user" }
{ id: "degen", type: "channel" }
```
- where `id` is any `channelId` or any user `FID` and the `type` is one of `user` or `channel` and must point if the source is a channel or a FID.

### Set up

- Create and add the required variables in the `.env` file:
```
cp .env.example .env
```
 Now open and add the required variables in your `.env` file, including a neynar signer to use with the agent, a neynar api key, a together-ai api key and a warpcast api key.
```
TOGETHER_API_KEY=
NEYNAR_API_KEY=
WC_API_KEY=
BOT_SIGNER_UUID=
```
- Read previous block of text, Are you not entertained?, to know how to set your favorites sources of interesting content to analyze in the farcaster network.
- The `ser/config.ts` file contains the remaining configurable settings for the agent.
- Select a limit for the number of casts fetched from channels and/or users.
- Set the recipient of the private report sent by Direct Cast and the channelId to send the public report to.


### Run

- Git clone or download the repo.

- Install dependencies
```
npm install
```

- Set up the cron task by removing the comments on it in the `src/index.ts` file or just run it manually with:
```
npm run dev
```

- Enjoy it. The agent should sent a direct cast report to the recipient and publish a public report in its account in the farcaster network.

