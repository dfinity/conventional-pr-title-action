import { it, expect, beforeAll } from "vitest";
import validateTitle from "./validateTitle.js";

it("detects valid PR titles", async () => {
  const inputs = [
    "fix: Fix bug",
    "fix: Fix bug\n\nBREAKING CHANGE: Fix bug",
    "feat: Add feature",
    "feat: Add feature\n\nBREAKING CHANGE: Add feature",
    "feat(scope): Add feature",
    "feat(scope): Add feature\n\nBREAKING CHANGE: Add feature",
    "feat(scope)!: Add feature with breaking change",
    "refactor: Internal cleanup",
    "feat!: Add feature with breaking change",
  ];

  for (let index = 0; index < inputs.length; index++) {
    const input = inputs[index];
    await validateTitle(input);
  }
});

it("throws for PR titles without a type", async () => {
  await expect(validateTitle("Fix bug")).rejects.toThrow(
    /No release type found in pull request title "Fix bug"./,
  );
});

it("throws for PR titles with an unknown type", async () => {
  await expect(validateTitle("foo: Bar")).rejects.toThrow(
    /Unknown release type "foo" found in pull request title "foo: Bar"./,
  );
});
