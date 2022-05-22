import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from './../app-material.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DivisionComponent } from './components/division/division.component';
import { EmployeeRoutingModule } from './employee-routing.module';
import { PositionComponent } from './components/position/position.component';
import { PositionDialogComponent } from './components/position/position-dialog/position-dialog.component';
import { SubDivisionComponent } from './components/sub-division/sub-division.component';
import { DivisionDialogComponent } from './components/division/division-dialog/division-dialog.component';
import { SubDivisionDialogComponent } from './components/sub-division/sub-division-dialog/sub-division-dialog.component';
import { EmployeeComponent } from './components/employee/employee.component';
import { EditEmployeeComponent } from './components/employee/edit-employee/edit-employee.component';

@NgModule({
  declarations: [DivisionComponent, PositionComponent, PositionDialogComponent, SubDivisionComponent, DivisionDialogComponent, SubDivisionDialogComponent, EmployeeComponent, EditEmployeeComponent],
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
