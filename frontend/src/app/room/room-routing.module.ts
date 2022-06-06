import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomImagesComponent } from './components/room-images/room-images.component';
import { RoomTypeComponent } from './components/room-type/room-type.component';
import { RoomComponent } from './components/room/room.component';

const routes: Routes = [
  { path: 'room-type', component: RoomTypeComponent },
  { path: 'rooms', component: RoomComponent },
  { path: 'room-images/:id', component: RoomImagesComponent },
  { path: '', redirectTo: 'rooms', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoomRoutingModule {}
