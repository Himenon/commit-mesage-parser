export type CommitType = "build" | "ci" | "docs" | "feat" | "fix" | "perf" | "refactor" | "revert" | "test" | "chore" | "release";

export type ParsedKind = "type" | "scope" | "first-line" | "short-summary" | "body" | "breaking-change";

/**
 * @see https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit-message-header
 */
export interface ParsedCommitMessage {
  type: CommitType;
  scope?: string;
  shortSummary: string;
  firstLineFullMessage: string;
  body?: string;
  footer?: string;
  breakingChanges?: string[];
  parsed: ParsedKind[];
}

const COMMIT_MESSAGE_REGEX = /^(build|ci|docs|feat|fix|perf|refactor|test|chore|revert|release)(\((.*)\))?(:\s)(.*)(\r?\n+)?/;

export interface CategorizeCommitMessage {
  others: string[];
  breakingChanges: string[];
}

export const categorizeCommitMessage = (text: string): CategorizeCommitMessage => {
  const list = text.split(/\r?\n+/);
  const others: string[] = [];
  const breakingChanges: string[] = [];
  list.forEach(item => {
    const [, description] = item.split(/^BREAKING CHANGE:/);
    if (!description) {
      if (item.trim()) {
        others.push(item);
      }
      return;
    }
    breakingChanges.push(description.trim());
  });
  return {
    others: others,
    breakingChanges,
  };
};

export const parseCommitMessage = (commitMessage: string): ParsedCommitMessage => {
  const [firstLineCommitMessage, ...rest] = commitMessage.split(/\r?\n+/);
  const matched = firstLineCommitMessage.match(COMMIT_MESSAGE_REGEX);
  if (!matched) {
    return {
      type: "chore",
      shortSummary: commitMessage,
      firstLineFullMessage: commitMessage,
      parsed: [],
    };
  }
  const [_0, type, _1, scope, _spacer, shortSummary] = matched;
  const body: string = rest.filter(Boolean).join("\n");
  const parsedCommitMessage: ParsedCommitMessage = {
    type: type as CommitType,
    shortSummary: shortSummary,
    firstLineFullMessage: firstLineCommitMessage,
    parsed: ["type", "short-summary", "first-line"],
  };
  if (scope) {
    parsedCommitMessage.scope = scope;
    parsedCommitMessage.parsed.push("scope");
  }
  if (body) {
    const { breakingChanges, others } = categorizeCommitMessage(body);
    if (breakingChanges.length > 0) {
      parsedCommitMessage.breakingChanges = breakingChanges;
      parsedCommitMessage.parsed.push("breaking-change");
    }
    if (others.length > 0) {
      parsedCommitMessage.body = others.join("\n");
      parsedCommitMessage.parsed.push("body");
    }
  }
  return parsedCommitMessage;
};
