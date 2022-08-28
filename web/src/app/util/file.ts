export const getFileExtension = (fileName: string) => {
  const split = fileName.split('.');
  if(split.length > 1)
    return split.slice(-1).pop();
  else return 'raw'
}
