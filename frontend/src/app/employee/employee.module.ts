import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DivisionComponent } from './components/division/division.component';
import { EmployeeRoutingModule } from './employee-routing.module';



@NgModule({
  declarations: [
    DivisionComponent
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule
  ]
})
export class EmployeeModule { }
