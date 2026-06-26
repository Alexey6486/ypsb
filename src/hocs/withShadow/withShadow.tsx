import type { JSX } from 'react';

export function withShadow(Component: () => JSX.Element) {
  return function ComponentWithShadow(): JSX.Element {
    return <Component />;
  };
}
