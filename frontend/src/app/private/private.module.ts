import { AppMaterialModule } from './../app-material.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PrivateRoutingModule } from './private-routing.module';
import { PrivateComponent } from './private.component';
import { HomeComponent } from './components/home/home.component';



@NgModule({
  declarations: [
    PrivateComponent,
    HomeComponent,
  ],
  imports: [
    CommonModule,
    PrivateRoutingModule,
    AppMaterialModule
  ]
})
export class PrivateModule { }
