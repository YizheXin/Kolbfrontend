export function parseSize(size: string | number | undefined): number {
    if (typeof size === 'number') return size;
    if (typeof size === 'string') return parseInt(size, 10);
    return 0;
  }