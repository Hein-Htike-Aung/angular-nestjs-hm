import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { RoomTypeService } from './../../services/room-type.service';
import { RoomType } from './../../models/room-type.model';
import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { from, of, switchMap, tap } from 'rxjs';
import { FileTypeResult } from 'file-type';
import { fromBuffer } from 'file-type/core';

type validFileExtension = 'png' | 'jpg' | 'jpeg';
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

@Component({
  selector: 'app-room-images',
  templateUrl: './room-images.component.html',
  styleUrls: ['./room-images.component.scss'],
})
export class RoomImagesComponent implements OnInit, OnDestroy {
  private sub: Subscription;
  roomType: RoomType;

  imageUrl1 = '../../../../../assets/images/default-image.png';
  imageUrl2 = '../../../../../assets/images/default-image.png';
  imageUrl3 = '../../../../../assets/images/default-image.png';

  validFileExtensions: validFileExtension[] = ['png', 'jpg', 'jpeg'];
  validMimeTypes: validMimeType[] = ['image/png', 'image/jpg', 'image/jpeg'];

  constructor(
    private roomTypeService: RoomTypeService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private builder: FormBuilder
  ) {
    this.sub = this.activatedRoute.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.roomTypeService
          .findById(id)
          .subscribe((resp) => (this.roomType = resp));
      }
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onImageSelect(event: any, image: string) {
    const file: File = (event.target as HTMLInputElement).files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    from(file.arrayBuffer())
      .pipe(
        switchMap((buffer: any) => {
          return from(fromBuffer(buffer)).pipe(
            tap((fileTypeResult: FileTypeResult) => {
              if (!fileTypeResult) {
                this.toastr.error('file format not supported!');
              }
              const { ext, mime } = fileTypeResult;
              const isFileTypeLegit = this.validFileExtensions.includes(
                ext as any
              );
              const isMimeTypeLegit = this.validMimeTypes.includes(mime as any);
              const isFileLegit = isFileTypeLegit && isMimeTypeLegit;
              if (!isFileLegit) {
                this.toastr.error('file format does not match file extension!');
              }
              // Set formData into FormGroup
              // this.personalInfoForm.get('image').setValue(formData);

              // Update UI with uploaded file
              var reader = new FileReader();
              reader.readAsDataURL(event.target.files[0]);
              reader.onload = (events: any) => {
                switch (image) {
                  case 'image1':
                    this.imageUrl1 = events.target.result;
                    break;
                  case 'image2':
                    this.imageUrl2 = events.target.result;
                    break;
                  case 'image3':
                    this.imageUrl3 = events.target.result;
                    break;
                }
              };
            })
          );
        })
      )
      .subscribe();
  }
}
