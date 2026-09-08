import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { routePaths } from './paths';

const ExamplePrompt = lazy(async () =>
  import('@/features/exampleChatLayout/ExamplePrompt').then(({ default: AP }) => ({ default: AP }))
);

export const exampleRouter: RouteObject[] = [
  {
    path: routePaths.examplePrompt,
    element: <ExamplePrompt />,
  },
];
