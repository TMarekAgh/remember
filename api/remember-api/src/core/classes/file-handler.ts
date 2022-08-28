import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs/promises';
import { createReadStream } from 'fs';
import { StreamableFile } from '@nestjs/common';

export class FileHandler {

    static savePath = './files/'; //TODO move to config

    static getFileData = async (file: any) => {
        const content = file.buffer;
        
        const extension = file.originalname.split('.').pop();

        return {
            file: `${uuidv4()}.${extension}`,
            type: file.mimetype,
            content
        }
    }

    static saveFile = async (file: SaveFile) => {
        await fs.writeFile(this.savePath + file.name, file.content);        
    }

    static removeFile = async (name: string) => {
        await fs.rm(this.savePath + name);
    }

    static retrieveFile = async (name: string, fileData: any) => {
        const file = createReadStream(this.savePath + name); 

        return new StreamableFile(file, { type: fileData.type });
    }

    static replaceFile = this.saveFile;
}

export interface SaveFile {
    name: string;
    content: string;
}

export type ReplaceFile = SaveFile;