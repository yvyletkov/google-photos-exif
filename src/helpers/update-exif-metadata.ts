import { exiftool } from 'exiftool-vendored';
import { doesFileSupportExif } from './does-file-support-exif';
import { promises as fspromises } from 'fs';
import { MediaFileInfo } from '../models/media-file-info';
import { resolve } from 'path';

const { unlink, copyFile } = fspromises;

export async function updateExifMetadata(fileInfo: MediaFileInfo, timeTaken: string): Promise<void | 'notSupportError' | 'writeError' | 'updatedCreateDate'> {
  if (!doesFileSupportExif(fileInfo.mediaFilePath)) {

    return 'notSupportError';
  }

  try {
    if (fileInfo.mediaFileExtension === '.png' || fileInfo.mediaFileExtension === '.PNG') {
      console.log('IS PNG!')
      await exiftool.write(fileInfo.mediaFilePath, {
        CreateDate: timeTaken,
      });
      return 'updatedCreateDate'
    }

    await exiftool.write(fileInfo.mediaFilePath, {
      DateTimeOriginal: timeTaken,
    });

    await unlink(`${fileInfo.mediaFilePath}_original`); // exiftool will rename the old file to {filename}_original, we can delete that

  } catch (error) {

    return 'writeError'

    // await copyFile(fileInfo.mediaFilePath,  resolve(errorDir, fileInfo.mediaFileName));
    // if (fileInfo.jsonFileExists && fileInfo.jsonFileName && fileInfo.jsonFilePath) {
    //   await copyFile(fileInfo.jsonFilePath, resolve(errorDir, fileInfo.jsonFileName));
    // }
  }
}
