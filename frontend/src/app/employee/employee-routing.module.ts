import { EditEmployeeComponent } from './components/employee/edit-employee/edit-employee.component';
import { EmployeeComponent } from './components/employee/employee.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DivisionComponent } from './components/division/division.component';
import { PositionComponent } from './components/position/position.component';
import { SubDivisionComponent } from './components/sub-division/sub-division.component';

const routes: Routes = [
  { path: 'division', component: DivisionComponent },
  { path: 'subDivision', component: SubDivisionComponent },
  { path: 'position', component: PositionComponent },
  {
    path: 'employee',
    component: EmployeeComponent,
    children: [{ path: ':id', component: EditEmployeeComponent }],
  },
  { path: '', redirectTo: 'employee', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeRoutingModule {}
