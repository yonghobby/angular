import { LoadingService } from './../../services/loading.service'
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'

@Component({
    selector: 'app-assignment5',
    templateUrl: './assignment5.component.html',
    styleUrls: ['./assignment5.component.scss'],
})
export class Assignment5Component implements OnInit {
    @ViewChild('mapContainer', { static: true })
    mapContainer!: ElementRef<HTMLDivElement>
    view!: __esri.MapView

    constructor(private loadingService: LoadingService) {}

    ngOnInit(): void {
        const initConfig = { center: [-116.5925, 34.40333], zoom: 7 }
        const map = new Map({
            basemap: 'streets-night-vector',
        })
        this.view = new MapView({
            container: this.mapContainer.nativeElement,
            map: map,
            ...initConfig,
        })

        this.view.when(() => {

        })
    }
}
