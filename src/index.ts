import type { ILauncherOptions } from 'minecraft-launcher-core';

export type LaunchConfig = {
  rootPath: string;
  gameVersion: string;
  loaderVersion?: string;
};

export type ModLoader = {
  /**
   * Downloads the latest version json and returns a partial MCLC config
   */
  getMCLCLaunchConfig(config: LaunchConfig): Promise<Partial<ILauncherOptions>>;
  /**
   * Returns all game versions a loader supports
   */
  listSupportedGameVersions(): Promise<{ version: string; stable: boolean }[]>;
  /**
   * Returns all loader versions. Note that these might not be available for all game versions
   */
  listAllLoaderVersions(): Promise<string[]>;
  /**
   * Returns all loader versions that are available for a given game version.
   */
  listLoaderVersions(gameVersion: string): Promise<string[]>;
  /**
   * The loader config for the 'tomate-mods' package
   */
  tomateModsModLoader: ModLoaderPlatformInfo;
};

export type ModLoaderPlatformInfo = {
  /**
   * @deprecated
   */
  overrideMods: Record<string, string>;

  modrinthCategories: string[];
  curseforgeCategory: string;
};

export type VanillaLoader = Omit<ModLoader, 'tomateModsModLoader'>;

export const loaderIds = [
  'quilt',
  'fabric',
  'forge',
  'neoforge',
  'vanilla',
] as const;

export type LoaderId = (typeof loaderIds)[number];
export type ModdedLoaderId = Exclude<LoaderId, 'vanilla'>;

export * as fabric from './loaders/fabric';
export * as quilt from './loaders/quilt';
export * as forge from './loaders/forge';
export * as neoforge from './loaders/neoforge';
export * as vanilla from './loaders/vanilla';

export { loader } from './loader';
export { liner } from './liner';
