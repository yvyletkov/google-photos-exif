import { exiftool } from 'exiftool-vendored';
import { isNullOrUndefined } from './is-null-or-undefined';
import { doesFileSupportExif } from './does-file-support-exif'

export async function doesFileHaveExifDate(filePath: string): Promise<boolean> {
  if (!doesFileSupportExif(filePath)) {
    return false;
  }
  
  const readResult = await exiftool.read(filePath);
  
  
  if(typeof readResult.DateTimeOriginal === 'string') {
    const cleanedDateStr =  readResult.DateTimeOriginal.replace(/\D/g, '');

    console.log({DateTimeOriginal: readResult.DateTimeOriginal, cleanedDateStr})

    return cleanedDateStr.length > 0
  }

  console.log({DateTimeOriginal: readResult.DateTimeOriginal})
  
  return !isNullOrUndefined(readResult.DateTimeOriginal)
}
