import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from './../app-material.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DivisionComponent } from './components/division/division.component';
import { EmployeeRoutingModule } from './employee-routing.module';
import { PositionComponent } from './components/position/position.component';
import { PositionDialogComponent } from './components/position/position-dialog/position-dialog.component';

@NgModule({
  declarations: [DivisionComponent, PositionComponent, PositionDialogComponent],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    AppMaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
})
export class EmployeeModule {}
