import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'AutoGridSortPipe',//name will be used in the page
    pure: false
})
export class AutoGridSortPipe implements PipeTransform {
    //Sort,Dir ... will be passed through the component
    transform(array: any[], [sortby, dir]: [string, number]) {
        array.sort((a: any, b: any) => {
            if (a[sortby] > b[sortby]) {
                return 1 * dir;//we switch ascending and descending by multiply x -1
            }
            if (a[sortby] < b[sortby]) {
                return -1 * dir;//we switch ascending and descending by multiply x -1
            }
            return 0;
        });
        return array;
    }
} 