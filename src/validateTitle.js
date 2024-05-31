import { sync as parser } from "conventional-commits-parser";
import conventionalCommitTypes from "conventional-commit-types";
import * as conventionalChangelogConfig from "conventional-changelog-conventionalcommits";

function isFunction(functionToCheck) {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === "[object Function]"
  );
}

export default async function validateTitle(title) {
  if (isFunction(conventionalChangelogConfig)) {
    conventionalChangelogConfig = await conventionalChangelogConfig();
  }
  const { parserOpts } = conventionalChangelogConfig;
  const result = parser(title, parserOpts);

  const allowedTypes = Object.keys(conventionalCommitTypes.types);

  const leniant = leniantCheck(title);

  if (!result.type && !leniant) {
    throw new Error(
      `No release type found in pull request title "${title}". The title should match the commit message format as specified by https://www.conventionalcommits.org/. ` +
        `\n\nPlease use one of these recognized types: ${allowedTypes.join(
          ", ",
        )}.`,
    );
  }

  if (!allowedTypes.includes(result.type) && !leniant) {
    throw new Error(
      `Unknown release type "${result.type}" found in pull request title "${title}".` +
        `\n\nPlease use one of these recognized types: ${allowedTypes.join(
          ", ",
        )}.`,
    );
  }
}

const leniantCheck = (title) => {
  // Check if the title matches the conventional commit pattern, including the optional exclamation mark

  const conventionalCommitRegex =
    /^(revert: )?(feat|fix|docs|style|refactor|perf|test|chore|revert|ci)(\(.+\))?!?: .{1,50}/;

  return conventionalCommitRegex.test(title);
};
