import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {

  constructor() {}

  transform(data: any[], predicate: ((data: any) => boolean)) {
    return data.filter(predicate)
  }

}
