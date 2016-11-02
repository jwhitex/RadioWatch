import { Component } from '@angular/core';

@Component({
    selector: 'nav-menu',
    template: require('./navmenu.component.html'),
    styles: [require('./navmenu.component.css'), require('../app.global.css')]
})
export class NavMenuComponent {
}
