const fs = require('fs');
const FileType = require('file-type');
import { v4 as uuidv4 } from 'uuid';
import { diskStorage } from 'multer';
import path = require('path');
import { from, Observable, of, switchMap } from 'rxjs';

type validFileExtension_Type = 'png' | 'jpeg' | 'jpg';
type validMime_Type = 'image/png' | 'image/jpeg' | 'image/jpg';

const validFileExtensions: validFileExtension_Type[] = ['png', 'jpeg', 'jpg'];
const validMimes: validMime_Type[] = ['image/png', 'image/jpeg', 'image/jpg'];

export class ImageStorage {
  static saveImage() {
    // Create images folder and save file into it
    return {
      storage: diskStorage({
        destination: './images',
        filename: (req, file, cb) => {
          const fileExtension: string = path.extname(file.originalname);
          const fileName: string = uuidv4() + fileExtension;
          cb(null, fileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes: validMime_Type[] = validMimes;
        allowedMimeTypes.includes(file.mimetype)
          ? cb(null, true)
          : cb(null, false);
      },
    };
  }

  static isImagePathSafe(imagePath: string): Observable<boolean> {
    return from(FileType.fromFile(imagePath)).pipe(
      switchMap(
        (fileExtensionAndMimeType: {
          ext: validFileExtension_Type;
          mime: validMime_Type;
        }) => {
          if (!fileExtensionAndMimeType) return of(false);

          const isFileTypeLegit = validFileExtensions.includes(
            fileExtensionAndMimeType.ext,
          );
          const isMimeTypeLegit = validMimes.includes(
            fileExtensionAndMimeType.mime,
          );
          const isFileLegit = isFileTypeLegit && isMimeTypeLegit;
          return of(isFileLegit);
        },
      ),
    );
  }

  static removeFile(imagePath: string) {
    try {
      fs.unlinkSync(imagePath);
    } catch (err) {
      console.error(err);
    }
  }
}
