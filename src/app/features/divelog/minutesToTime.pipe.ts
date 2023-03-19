import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'minutesToTime'})
export class MinutesToTimehPipe implements PipeTransform {
  transform(minutes: number): string {
    minutes = Math.round(minutes);
    if(minutes < 60) {
        return '00:' + this.format2Digits(minutes);
    } else {
        const h = Math.floor(minutes / 60);
        const min = minutes - h*60;
        return this.format2Digits(h) + ':' + this.format2Digits(min);
    }
  }

  private format2Digits(num: number): string {
      return num < 10 ? '0' + num : String(num);
  }
}