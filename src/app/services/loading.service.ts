import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class LoadingService {
    private _loading = new BehaviorSubject<boolean>(false)
    public readonly loading$ = this._loading.asObservable()
    start: number = 1
    end: number = 2

    showLoading() {
        this.start = new Date().getTime()
        this._loading.next(true)
    }

    hideLoading() {
        this.end = new Date().getTime()
        this._loading.next(false)
        this.start = new Date().getTime()
        this.end = new Date().getTime()
    }
}
