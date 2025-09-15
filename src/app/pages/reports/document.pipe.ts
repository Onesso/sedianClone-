import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'documentPipe'
})
export class DocumentPipe implements PipeTransform {

  transform(value?: any, args?: any): any[]{
    if (!args) {
      return value;
    }
    // created_at
    return value.filter((val: any) => {
      const rVal = (val.accountTitle?.toLowerCase().includes(args)) || (val.accountid?.toLowerCase().includes(args));
      return rVal;
    });
  }

}
