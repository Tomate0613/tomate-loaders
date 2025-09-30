import axios from 'axios';
import type { LaunchConfig } from '..';
import path from 'node:path';
import fs from 'node:fs';
import { InvalidVersionError } from '../errors';

export const id = 'vanilla';

export const url = 'https://www.minecraft.net/';

export type VersionManifest = {
  latest: { release: string; snapshot: string };
  versions: {
    id: string;
    type: 'snapshot' | 'release';
    url: string;
    time: string;
    releaseTime: string;
    sha1: string;
    complianceLevel: number;
  }[];
};

export async function getVersionManifest() {
  return (
    await axios.get<VersionManifest>(
      'https://piston-meta.mojang.com/mc/game/version_manifest_v2.json'
    )
  ).data;
}

export async function getVersion(gameVersion: string) {
  const manifest = await getVersionManifest();

  const version = manifest.versions.find(
    (version) => version.id === gameVersion
  );

  if (!version) {
    throw new InvalidVersionError(gameVersion);
  }

  return version;
}

export async function downloadVersionFile(
  config: LaunchConfig,
  custom?: string
) {
  const versionPath = path.join(
    config.rootPath,
    'versions',
    custom ?? config.gameVersion,
    `${config.gameVersion}.json`
  );

  const version = await getVersion(config.gameVersion);

  fs.mkdirSync(path.dirname(versionPath), { recursive: true });
  fs.writeFileSync(versionPath, JSON.stringify(version));
}

/**
 * Downloads the latest version json and returns a partial MCLC config
 */
export async function getMCLCLaunchConfig(config: LaunchConfig) {
  return {
    root: config.rootPath,
    version: {
      number: config.gameVersion,
      type: 'release',
    },
  };
}

/**
 * Returns all game versions a loader supports
 */
export async function listSupportedGameVersions() {
  const versionManifest = await getVersionManifest();
  return versionManifest.versions.map((version) => ({
    version: version.id,
    stable: version.type === 'release',
  }));
}

/**
 * Returns all loader versions. Note that these might not be available for all game versions
 * This returns `['vanilla']` on vanilla
 */
export async function listAllLoaderVersions() {
  return ['vanilla'] satisfies ['vanilla'];
}
/**
 * Returns all loader versions that are available for a given game version.
 * This returns the same as listAllLoaderVersions on vanilla
 */
export async function listLoaderVersions(_gameVersion: string) {
  return listAllLoaderVersions();
}
