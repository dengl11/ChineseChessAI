/// <reference path="../typings/index.d.ts" />
import { bootstrap }    from '@angular/platform-browser-dynamic';
import { AppComponent } from './app/component_main/app.component.main';
import {Http, Response, XHRBackend, HTTP_PROVIDERS} from '@angular/http';
import {disableDeprecatedForms, provideForms} from '@angular/forms';


bootstrap(AppComponent,
  [
    HTTP_PROVIDERS
  ])
  .catch(err => console.error(err));
