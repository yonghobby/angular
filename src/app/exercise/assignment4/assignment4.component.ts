import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'

import { LoadingService } from 'src/app/services/loading.service'

@Component({
    selector: 'app-assignment4',
    templateUrl: './assignment4.component.html',
    styleUrls: ['./assignment4.component.scss'],
})
export class Assignment4Component implements OnInit {
    @ViewChild('mapContainer', { static: true })
    mapContainer!: ElementRef<HTMLDivElement>

    view!: __esri.MapView

    constructor(private loadingService: LoadingService) {}

    ngOnInit(): void {
        const initConfig = { center: [-117.161087, 32.715736], zoom: 15 }

        const map = new Map({
            basemap: 'topo-vector',
        })
        this.view = new MapView({
            container: this.mapContainer.nativeElement,
            map: map,
            ...initConfig,
        })

        this.view.when(() => {
            this.loadingService.hideLoading()

            this.view.on('click', this.onViewClick.bind(this))
        })
    }

    onViewClick(evt: __esri.ViewClickEvent) {

    }

}
