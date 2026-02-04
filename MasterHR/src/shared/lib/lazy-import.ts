import { lazy } from 'react';

import type { ComponentType } from 'react';

export function lazyImport<T extends ComponentType<object>, I extends { [K2 in K]: T }, K extends keyof I>(
  factory: () => Promise<I>,
  name: K
): I {
  return Object.create({
    [name]: lazy(() => factory().then((module) => ({ default: module[name] }))),
  });
}
