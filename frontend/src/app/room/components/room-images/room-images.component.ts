import { RoomImage } from './../../models/room-image';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
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
interface imageType {
  imageId?: number;
  image: string;
}
@Component({
  selector: 'app-room-images',
  templateUrl: './room-images.component.html',
  styleUrls: ['./room-images.component.scss'],
})
export class RoomImagesComponent implements OnInit, OnDestroy {
  private sub: Subscription;
  roomType: RoomType;
  imageForm: FormGroup;

  defualtImageUrl = '../../../../../assets/images/default-image.png';

  validFileExtensions: validFileExtension[] = ['png', 'jpg', 'jpeg'];
  validMimeTypes: validMimeType[] = ['image/png', 'image/jpg', 'image/jpeg'];

  constructor(
    private roomTypeService: RoomTypeService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private builder: FormBuilder
  ) {
    this.imageForm = this.builder.group({
      images: this.builder.array([]),
    });

    this.addImageForForm();
    this.addImageForForm();
    this.addImageForForm();

    this.sub = this.activatedRoute.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.roomTypeService.findById(id).subscribe((resp) => {
          this.roomType = resp;

          this.images.patchValue(this.roomType.roomImages);
        });
      }
    });
  }

  getImageUrlByImageName(imageName: string) {
    const result = this.roomTypeService.findRoomImageByName(imageName);

    this.sub = result.subscribe();

    return result;
  }

  addImageForForm(id = 0, image = '') {
    this.images.push(
      this.builder.group({
        id,
        image,
      })
    );
  }

  get images(): FormArray {
    return this.imageForm.get('images') as FormArray;
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onImageSelect(event: any, roomImage: RoomImage) {
    const file: File = (event.target as HTMLInputElement).files[0];
    if (!file) return;

    let isImageUpdated = false;

    const formData = new FormData();
    formData.append('file', file);

    from(file.arrayBuffer())
      .pipe(
        switchMap((buffer: any) => {
          return from(fromBuffer(buffer)).pipe(
            tap((fileTypeResult: FileTypeResult) => {
              // Check File is Valid
              this.checkFileIsValid(fileTypeResult);

              // Update Photo
              if (roomImage.id) {
                this.roomTypeService
                  .updateRoomImage(this.roomType.id, roomImage.id, formData)
                  .subscribe({
                    next: (resp) => {
                      // Update UI with uploaded file
                      this.images.controls.map((imageControl) => {
                        if (imageControl.value.id === resp.id) {
                          imageControl.setValue(resp);
                        }
                      });
                    },
                    error: (err) => this.toastr.error(err.error.message),
                  });
              } else {
                // Add Photo
                this.roomTypeService
                  .addRoomImage(this.roomType.id, formData)
                  .subscribe({
                    next: (resp) => {
                      // Update UI with uploaded file
                      delete resp.room_type;
                      const target = this.images.controls.find(
                        (imageControl) => imageControl.value.image === ''
                      );
                      target.setValue(resp);
                    },
                    error: (err) => this.toastr.error(err.error.message),
                  });
              }
            })
          );
        })
      )
      .subscribe();
  }

  checkFileIsValid(fileTypeResult: FileTypeResult) {
    if (!fileTypeResult) {
      this.toastr.error('file format not supported!');
    }
    const { ext, mime } = fileTypeResult;
    const isFileTypeLegit = this.validFileExtensions.includes(ext as any);
    const isMimeTypeLegit = this.validMimeTypes.includes(mime as any);
    const isFileLegit = isFileTypeLegit && isMimeTypeLegit;
    if (!isFileLegit) {
      this.toastr.error('file format does not match file extension!');
    }
  }
}
