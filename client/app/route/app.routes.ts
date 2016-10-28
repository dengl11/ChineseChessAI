import { provideRouter, RouterConfig } from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from "@angular/common";
import { AppComponent } from '../component_main/app.component.main';

const routes: RouterConfig = [
  // { path: 'testJulia', component: ComponentTestJulia }
];

export const appRouterProviders = [
  provideRouter(routes),
  { provide: LocationStrategy, useClass: HashLocationStrategy }
];
