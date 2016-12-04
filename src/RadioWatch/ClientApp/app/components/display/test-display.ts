import {
    Component,
    OnInit,
    AfterViewInit,
    Input,
    trigger,
    state,
    style,
    transition,
    animate
} from '@angular/core';

@Component({
    selector: 'test-display',
    templateUrl: './test-display.html',
    styleUrls: ['./test-display.css'],
    animations: [
        trigger('gridExpansionAnimationState', [
            state('in', style({ height: '*', opacity: 1 })),
            transition('* => void', [
                style({ height: '*', opacity: 1 }),
                animate(300, style({ height: 0 })),
                animate(300, style({ opacity: 0 })),
            ]),
            transition('void => *', [
                style({ height: 0, opacity: 0 }),
                animate(300, style({ height: '*' })),
                animate(300, style({ opacity: 1 }))
            ]),
        ])
    ]

})
export class TestDisplayComponent implements OnInit {
    constructor() { }
    state = 'inactive';
    ngOnInit() { }

    changeState() {
        // 'gridExpansionAnimationState'
        this.state = this.state == 'inactive' ? 'active' : 'inactive';
    }
}