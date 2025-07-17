import multer, { memoryStorage } from 'multer';

let storage = memoryStorage();

export default multer({
  storage,
});
