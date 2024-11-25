import { LoadingService } from './../../services/loading.service'
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'

@Component({
    selector: 'app-assignment6',
    templateUrl: './assignment6.component.html',
    styleUrls: ['./assignment6.component.scss'],
})
export class Assignment6Component {
    @ViewChild('mapContainer', { static: true })
    mapContainer!: ElementRef<HTMLDivElement>
    view!: __esri.MapView

    constructor(private loadingService: LoadingService) {}

    ngOnInit(): void {
        const initConfig = { center: [-116.5925, 34.40333], zoom: 7 }

        const map = new Map({
            basemap : 'topo-vector',
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
