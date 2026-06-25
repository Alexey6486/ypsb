import type { TSvg } from '@types/svg';
import type { JSX } from 'react';

export function withIcon(Component: ({ fill }: TSvg) => JSX.Element) {
  return function ComponentWithIcon({ fill }: TSvg): JSX.Element {
    return <Component fill={fill} />;
  };
}
