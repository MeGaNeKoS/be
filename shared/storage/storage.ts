import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class StorageService {
  async upload(file: Express.Multer.File): Promise<string> {
    const uploadDir = join(__dirname, '..', 'uploads');
    const filePath = join(uploadDir, file.originalname);

    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filePath, file.buffer);

    return filePath;
  }
}
