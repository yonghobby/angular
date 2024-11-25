import { ChangeDetectorRef, Component } from '@angular/core'
import { Router } from '@angular/router'

@Component({
    selector: 'core-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
    menuList: Array<HomeMenuItem> = [
        { id: 1, name: '#01 (Query Task)' },
        { id: 2, name: '#02 (Closest Facility)' },
        { id: 3, name: '#03 (Sketch)' },
        { id: 4, name: '#04 (Route)' },
        { id: 5, name: '#05 (Layer List)' },
        { id: 6, name: '#06 (Swipe)' },
        { id: 7, name: '#07 (Secured Map)' },
        { id: 8, name: '#08 (Counter)' },
        { id: 9, name: '#09 (loan form)' },
        { id: 10, name: '#10 (todo list)' },
        { id: 11, name: '#11 (Intermediate 1)' },
        { id: 12, name: '#12 (Measurement)' },
        { id: 13, name: '#13 (Test Concept)' },
        { id: 14, name: '#14 (Test Concept2)' },
        { id: 15, name: '#15 (RegExr)' },
        { id: 16, name: '#16 (Share Facebook)' }
    ]

    currentPageNumber: number = -1

    constructor(private router: Router, private changeDetectorRef: ChangeDetectorRef) {
        const url = window.location.href
        const tabMenuId = url.substring(url.length, url.length - 1) // => "1"
        this.currentPageNumber = Number(tabMenuId)
    }
    onClickChangeMenu(id: number) {
        this.currentPageNumber = id
        this.router.navigateByUrl(`/assignment${id}`)
    }
}
