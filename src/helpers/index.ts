import { LogLevel } from './types';

export const untrailingSlashIt = (str: string): string =>
  str.replace(/\/$/, '');

export const trailingSlashIt = (str: string): string =>
  untrailingSlashIt(str) + '/';

export const unprecedingSlashIt = (str: string): string =>
  str.replace(/^\//, '');

export const precedingSlashIt = (str: string): string =>
  '/' + unprecedingSlashIt(str);

export const normalizePath = (text: string) => trailingSlashIt(text);

export const stringifyObject = (object: Record<string, string>) =>
  Object.entries(object)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');

export const logLevels: Record<LogLevel, LogLevel> = {
  SYSTEM: 'SYSTEM',
  ERROR: 'ERROR',
  WARNING: 'WARNING',
  DEBUG: 'DEBUG',
};

export const log = (text: string, level: LogLevel = logLevels.ERROR) => {
  const levelKey = Object.values(logLevels).indexOf(global.logLevel);
  const validKeys = Object.values(logLevels).splice(0, levelKey + 1);
  if (validKeys.indexOf(level) !== -1) {
    console.log(
      `node-image-processing${
        level === logLevels.SYSTEM ? '' : ` ${level}`
      }: ${text}`
    );
  }
};
