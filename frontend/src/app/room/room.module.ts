import { RoomTypeComponent } from './components/room-type/room-type.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from './../app-material.module';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoomRoutingModule } from './room-routing.module';
import { RoomImagesComponent } from './components/room-images/room-images.component';
import { RoomTypeDialogComponent } from './components/room-type/room-type-dialog/room-type-dialog.component';
import { RoomDialogComponent } from './components/room/room-dialog/room-dialog.component';
import { RoomComponent } from './components/room/room.component';

@NgModule({
  declarations: [
    RoomImagesComponent,
    RoomTypeDialogComponent,
    RoomTypeComponent,
    RoomDialogComponent,
    RoomComponent,
  ],
  imports: [
    CommonModule,
    RoomRoutingModule,
    HttpClientModule,
    AppMaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class RoomModule {}
