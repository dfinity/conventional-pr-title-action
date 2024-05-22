import path from "path";
import * as core from "@actions/core";
import { exec } from "child_process";

/**
 * Install preset
 * @returns {Promise<void>}
 */
export default async (preset) => {
  const { stdout, stderr } = await exec(`npm install --quiet ${preset}`, {
    cwd: path.resolve(__dirname),
  });
  core.debug(stderr);
  return Promise.resolve();
};
