import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgSemanticModule } from "ng-semantic";
import { AppComponent } from './component_main/app.component.main';

import { BoardComponent } from './component_board/board';
import { MapToIterable} from './pipe/MapToIterable';


@NgModule({
    imports: [
        BrowserModule,
        NgSemanticModule,
    ],
    bootstrap: [
        AppComponent
    ],
    declarations: [
        AppComponent, 
        BoardComponent,
        MapToIterable
        ]
})
export class AppModule { }
