import { NodeContentType } from "../enums/node-content-type.enum";
import { FileHandler } from "./file-handler";

export class ContentHandler {
    static async getContentData(contentType: NodeContentType, contentData: any, opt: any = null) {
        switch(+contentType) {
            case NodeContentType.File:        
                const file = opt.find(x => x.originalname == contentData.file);    
                const data = await FileHandler.getFileData(file);                        

                return {
                    file: data.file,
                    type: data.type,
                    content: data.content
                };
            case NodeContentType.Direct:

                return {
                    content: data.content,
                    type: data.type
                }
            default:
                return null;
        }
    }

    static async saveContent(contentType: NodeContentType, contentData: any) {
        switch(+contentType) {
            case NodeContentType.File:
                await FileHandler.saveFile({
                    name: contentData.file,
                    content: contentData.content
                })
                break;
            default: 
                break;
        }        
    }

    static async deleteContent(contentType: NodeContentType, contentData: any) {
        switch(+contentType) {
            case NodeContentType.File:
                await FileHandler.removeFile(
                    contentData.file
                )
                break;
            default: 
                break;
        }
    }

    static async getContent(contentType: NodeContentType, contentData: any) {
        switch(+contentType) {
            case NodeContentType.File:
                return await FileHandler.retrieveFile(contentData.file, contentData);
            case NodeContentType.Direct:
                return {
                    ...contentData
                }
            default: 
                return null;
        }
    }

    static replaceContent = this.saveContent;
}