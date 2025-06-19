import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    entry: './src/index.js',

    output: {
        filename: '_anki-md.main.js',
        chunkFilename: '_anki-md.main.[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {

    },

    mode: 'production',
};