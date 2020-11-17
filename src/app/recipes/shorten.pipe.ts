/** Creating a custom pipe for angular templates
 * Pipe === get something => transform => send something;
 */
import { Pipe, PipeTransform } from '@angular/core';

// implements PipeTransform interface and provide transform method
@Pipe({ name: 'shortenText' })
export class ShortenPipe implements PipeTransform {
  transform(value: any, limit: number) {
    return value.length > limit ? value.substr(0, limit) + ' ...' : value;
  }
}
