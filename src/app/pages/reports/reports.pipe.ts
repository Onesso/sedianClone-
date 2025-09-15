import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reports'
})
export class ReportsPipe implements PipeTransform {

  transform(value?: any, args?: any): any[]{
    if (!args) {
      return value;
    }
    // created_at
    return value.filter((val: any) => {
      const rVal = (val.national_id?.toLowerCase().includes(args)) || (val.accountTitle?.toLowerCase().includes(args));
      return rVal;
    });
  }

}
