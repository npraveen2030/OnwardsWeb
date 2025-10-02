import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router, Route } from '@angular/router';
import { filter } from 'rxjs';

export interface Breadcrumb {
  label: string;
  url: string;
}

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  breadcrumbs: Breadcrumb[] = [];

  constructor(private router: Router) {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.breadcrumbs = this.buildBreadcrumbs(this.router.routerState.snapshot.root);
    });
  }

  private buildBreadcrumbs(
    route: ActivatedRouteSnapshot,
    url: string = '',
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    const routeConfig = route.routeConfig;

    if (routeConfig?.data?.['breadcrumb']) {
      const path = routeConfig.path ?? '';
      const nextUrl = url + '/' + path;

      // resolve parent recursively
      if (routeConfig.data['parent']) {
        this.addParentBreadcrumbs(routeConfig.data['parent'], breadcrumbs);
      }

      // add current breadcrumb
      breadcrumbs.push({
        label: routeConfig.data['breadcrumb'],
        url: nextUrl,
      });

      url = nextUrl;
    }

    if (route.firstChild) {
      return this.buildBreadcrumbs(route.firstChild, url, breadcrumbs);
    }

    return breadcrumbs;
  }

  private addParentBreadcrumbs(parentPath: string, breadcrumbs: Breadcrumb[]) {
    const parentRoute = this.findRouteByPath(parentPath, this.router.config);

    if (parentRoute?.data?.['breadcrumb']) {
      // recursively add parent’s parent
      if (parentRoute.data['parent']) {
        this.addParentBreadcrumbs(parentRoute.data['parent'], breadcrumbs);
      }

      // only add if not already included
      if (!breadcrumbs.some((b) => b.url === parentPath)) {
        breadcrumbs.push({
          label: parentRoute.data['breadcrumb'],
          url: parentPath,
        });
      }
    }
  }

  private findRouteByPath(path: string, routes: Route[]): Route | undefined {
    for (const route of routes) {
      if ('/' + route.path === path) {
        return route;
      }
      if (route.children) {
        const found = this.findRouteByPath(path, route.children);
        if (found) return found;
      }
    }
    return undefined;
  }
}
