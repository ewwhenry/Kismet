import { IRoute, Router } from 'express';

export default function routeMapping(path: string, router: Router) {
  return router.stack
    .map(({ route }) => {
      if (!route) return;
      return Object.entries(
        (route as IRoute & { methods: Record<string, boolean> })!.methods,
      )
        .filter(([_method, is]) => (is ? true : false))
        .map(([method, _is]) => ({
          route: path + route!.path,
          method: method.toUpperCase(),
        }));
    })
    .flat()
    .filter(Boolean);
}
