import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'indexValue',
  pure: false
})
export class IndexValuePipe implements PipeTransform {

  constructor() {}

  transform(data: any[]) {
    return data.map((x, i) => ({ value: x, index: i }))
  }

}
