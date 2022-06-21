# @himenon/commit-message-parser

## Usage

**Install**

```bash
npm  install @himenon/commit-message-parser
yarn add     @himenon/commit-message-parser
pnpm install @himenon/commit-message-parser
```

**API**

```ts
import { parseCommitMessage } from "@himenon/commit-message-parser";

parseCommitMessage("feat: new features");
{
  type: "feat",
  shortSummary: "new features",
  firstLineFullMessage: "feat: new features",
  parsed: ["type", "short-summary", "first-line"],
}

const tooLengthCommitMessage = `feat: abcdefg

body text
next body text`

parseCommitMessage(tooLengthCommitMessage);
{
  type: "feat",
  shortSummary: "abcdefg",
  firstLineFullMessage: "feat: abcdefg",
  parsed: ["type", "short-summary", "first-line", "body"],
  body: `body text
next body text`,
}
```

## Release

- Automatic version updates are performed when merged into the `main` branch.

## LICENCE

[@Himenon/commit-message-parser](https://github.com/Himenon/commit-message-parser)・MIT
