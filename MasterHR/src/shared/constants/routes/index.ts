import { createBrowserRouter } from 'react-router-dom';

import { transformRoutesForBrowserRouter } from '@/shared/lib/transform-routes-for-browser-router';

import { UNAUTHENTICATED_ROUTES } from './unauthenticated-routes';
import { AUTHENTICATED_ROUTES } from './authenticated-routes';

const PREPARED_ROUTER = transformRoutesForBrowserRouter(AUTHENTICATED_ROUTES);

export const AUTHENTICATED_ROUTER = createBrowserRouter([PREPARED_ROUTER]);
export const UNAUTHENTICATED_ROUTER = createBrowserRouter([UNAUTHENTICATED_ROUTES]);
