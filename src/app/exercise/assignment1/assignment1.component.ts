import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'

import Graphic from '@arcgis/core/Graphic'
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol'
import { LoadingService } from 'src/app/services/loading.service'

@Component({
    selector: 'app-assignment1',
    templateUrl: './assignment1.component.html',
    styleUrls: ['./assignment1.component.scss'],
})
export class Assignment1Component implements OnInit {
    @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLDivElement>
    view!: __esri.MapView

    constructor(private loadingService: LoadingService) {}

    ngOnInit(): void {
        const initConfig = { center: [-98, 40], zoom: 5 }

        const map = new Map({
            basemap: 'topo-vector',
        })
        this.view = new MapView({
            container: this.mapContainer.nativeElement,
            map: map,
            ...initConfig,
        })
        this.loadingService.showLoading()
        
        this.view.when(() => {
            this.loadingService.hideLoading()
        })
    }
}
