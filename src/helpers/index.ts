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
