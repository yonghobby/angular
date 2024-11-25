import { ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { LoadingService } from './services/loading.service'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'arcgis-sdk-training-2024'
    isLoading: boolean = false
    constructor(private loadingService: LoadingService, private changeDetectorRef: ChangeDetectorRef) {
        this.loadingService.loading$.subscribe((loading) => {
            this.isLoading = loading
            this.changeDetectorRef.detectChanges()
        })
    }
}
