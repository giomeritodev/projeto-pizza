import multer from 'multer';

export default {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 4 * 1024 * 1024 // Limite de 4MB para arquivos
    },
    fileFilter: (req: any, file: Express.Multer.File, cb: any) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/JPG'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Tipo de arquivo não permitido. Apenas JPEG, PNG e JPG são aceitos.'));
        }
    }
}