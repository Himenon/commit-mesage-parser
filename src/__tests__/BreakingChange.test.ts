import { expect, test } from "vitest";

import * as Module from "../index";

test("Extract Breaking Change Description", () => {
  const input = `
BREAKING CHANGE: abc 123 45(6) @_[];
hogehoge
fugafuga
BREAKING CHANGE: @(123)#456 ok false?!
    `;
  expect(Module.categorizeCommitMessage(input)).toStrictEqual<Module.CategorizeCommitMessage>({
    others: ["hogehoge", "fugafuga"],
    breakingChanges: ["abc 123 45(6) @_[];", `@(123)#456 ok false?!`],
  });
});
