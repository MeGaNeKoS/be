import * as dotenv from 'dotenv-safe';
import * as path from 'path';

dotenv.config({
  // Fix this later
  example: path.resolve(__dirname, '../../../../service/room', '.env.example'),
  path: path.resolve(__dirname, '../../../../service/room', '.env')
});
