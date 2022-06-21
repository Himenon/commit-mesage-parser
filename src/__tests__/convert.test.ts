import { expect, test } from "vitest";

import * as Module from "../index";

test("Exstract Parameter", () => {
  expect(Module.parseCommitMessage("feat: hoge")).toStrictEqual<Module.ParsedCommitMessage>({
    type: "feat",
    shortSummary: "hoge",
    firstLineFullMessage: "feat: hoge",
    parsed: ["type", "short-summary", "first-line"],
  });
  expect(Module.parseCommitMessage("feat(comment): fuga")).toStrictEqual<Module.ParsedCommitMessage>({
    type: "feat",
    scope: "comment",
    shortSummary: "fuga",
    firstLineFullMessage: "feat(comment): fuga",
    parsed: ["type", "short-summary", "first-line", "scope"],
  });
  expect(Module.parseCommitMessage("fuga")).toStrictEqual<Module.ParsedCommitMessage>({
    type: "chore",
    shortSummary: "fuga",
    firstLineFullMessage: "fuga",
    parsed: [],
  });
  expect(Module.parseCommitMessage("release: v0.5.0")).toStrictEqual<Module.ParsedCommitMessage>({
    type: "release",
    shortSummary: "v0.5.0",
    firstLineFullMessage: "release: v0.5.0",
    parsed: ["type", "short-summary", "first-line"],
  });
});

test("Extract Body Pattern 1", () => {
  const commitMessage = `feat: abcdefg

body text`;
  expect(Module.parseCommitMessage(commitMessage)).toStrictEqual<Module.ParsedCommitMessage>({
    type: "feat",
    shortSummary: "abcdefg",
    body: "body text",
    firstLineFullMessage: "feat: abcdefg",
    parsed: ["type", "short-summary", "first-line", "body"],
  });
});

test("Extract Body Pattern 2", () => {
  const commitMessage = `feat: abcdefg

body text
next body text`;
  expect(Module.parseCommitMessage(commitMessage)).toStrictEqual<Module.ParsedCommitMessage>({
    type: "feat",
    shortSummary: "abcdefg",
    firstLineFullMessage: "feat: abcdefg",
    parsed: ["type", "short-summary", "first-line", "body"],
    body: `body text
next body text`,
  });
});

test("Breaking Change", () => {
  const commitMessage = `feat: abcdefg

BREAKING CHANGE: abc 123 456 @[];
dummy message
BREAKING CHANGE: @(123)#456 ok false?!`;
  expect(Module.parseCommitMessage(commitMessage)).toStrictEqual<Module.ParsedCommitMessage>({
    type: "feat",
    shortSummary: "abcdefg",
    body: `dummy message`,
    firstLineFullMessage: "feat: abcdefg",
    breakingChanges: ["abc 123 456 @[];", "@(123)#456 ok false?!"],
    parsed: ["type", "short-summary", "first-line", "breaking-change", "body"],
  });
});
