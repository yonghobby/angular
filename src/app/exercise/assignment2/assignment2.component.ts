import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import { LoadingService } from 'src/app/services/loading.service';
import { buffer } from '@arcgis/core/geometry/geometryEngine';
import * as closestFacility from '@arcgis/core/rest/closestFacility';
import ClosestFacilityParameters from '@arcgis/core/rest/support/ClosestFacilityParameters';
import FeatureSet from '@arcgis/core/rest/support/FeatureSet';
import Graphic from '@arcgis/core/Graphic';
import Color from '@arcgis/core/Color';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol';

@Component({
    selector: 'app-assignment2',
    templateUrl: './assignment2.component.html',
    styleUrls: ['./assignment2.component.scss'],
})
export class Assignment2Component implements OnInit {
    @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLDivElement>;
    view!: __esri.MapView;
    facilityNames: string[] = [];
    private citiesLayer!: FeatureLayer;
    private graphicsLayer!: GraphicsLayer;
    private incidentGraphic!: Graphic;

    constructor(private loadingService: LoadingService) { }

    selectedCityIndex: number = -1;

    ngOnInit(): void {
        const initConfig = { center: [-117.161087, 32.715736], zoom: 11 };

        const map = new Map({
            basemap: 'topo-vector',
        });
        this.view = new MapView({
            container: this.mapContainer.nativeElement,
            map: map,
            ...initConfig,
        });

        this.loadingService.showLoading();
        this.view.when(() => {
            this.loadingService.hideLoading();
        });

        this.citiesLayer = new FeatureLayer({
            url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0'
        });
        map.add(this.citiesLayer);

        this.graphicsLayer = new GraphicsLayer();
        map.add(this.graphicsLayer);

        this.view.on('click', (event) => this.handleMapClick(event));
    }

    handleMapClick(event: __esri.ViewClickEvent) {
        this.clearExistingFacilities();
        const point = event.mapPoint;
        this.createIncidentGraphic(point);
        this.createBuffer(point);
    }

    createIncidentGraphic(point: __esri.Point) {
        this.incidentGraphic = new Graphic({
            geometry: point,
            symbol: {
                type: 'simple-marker',
                color: 'red',
                size: '8px'
            } as any
        });
        this.graphicsLayer.add(this.incidentGraphic);
    }

    createBuffer(point: __esri.Point) {
        const bufferGeometry = buffer(point, 20000, 'meters');
        const polygon = Array.isArray(bufferGeometry) ? bufferGeometry[0] : bufferGeometry;
        const bufferGraphic = new Graphic({
            geometry: polygon,
            symbol: {
                type: 'simple-fill',
                color: [0, 0, 255, 0.1],
                outline: {
                    color: [0, 0, 255, 0.8],
                    width: 2
                }
            } as any
        });
        this.graphicsLayer.add(bufferGraphic);
        this.queryFeatures(polygon);
    }

    queryFeatures(buffer: __esri.Polygon) {
        const query = this.citiesLayer.createQuery();
        query.geometry = buffer;
        query.spatialRelationship = 'intersects';
        query.returnGeometry = true;
        this.citiesLayer.queryFeatures(query).then(response => {
            this.processQueryResults(response.features);
        });
    }

    processQueryResults(features: __esri.Graphic[]) {
        // const facilityGraphics = features.map(feature => new Graphic({
        //     geometry: feature.geometry,
        //     symbol: {
        //         type: 'simple-marker',
        //         color: 'blue',
        //         size: '6px'
        //     }as any,
        //     attributes: {
        //         name: feature.attributes.areaname,
        //         objectId: feature.attributes.areaname
        //     }
        // }));

        console.log('features',features);
        const facilityGraphics = features.map(feature => {
            //console.log('feature',feature);
            return new Graphic({
                geometry: feature.geometry,
                symbol: {
                    type: 'simple-marker',
                    color: 'blue',
                    size: '6px'
                } as any,
                attributes: {
                    name: feature.attributes.areaname,
                    objectid: feature.attributes.objectid                    
                }
            })
        });


        facilityGraphics.forEach(graphic => this.graphicsLayer.add(graphic));
        this.performClosestFacilityAnalysis(facilityGraphics);
    }

    performClosestFacilityAnalysis(facilities: __esri.Graphic[]) {
        console.log("facilities", facilities);
        closestFacility.solve('https://sampleserver6.arcgisonline.com/arcgis/rest/services/NetworkAnalysis/SanDiego/NAServer/ClosestFacility',
            new ClosestFacilityParameters({
                incidents: new FeatureSet({
                    features: [this.incidentGraphic]
                }),
                facilities: new FeatureSet({
                    features: facilities
                }),
                preserveObjectID: true,
                returnRoutes: true,
                returnFacilities: true,
                defaultTargetFacilityCount: 10
            })
        ).then(response => {
            console.log("response", response);
            this.displayRoutes(response.routes.features);
            this.displayFacilities(response.routes.features, facilities);
        });
    }

    displayRoutes(routes: __esri.Graphic[]) {
        const routeGraphics = routes.map(route => {
            const graphic = new Graphic({
                geometry: route.geometry,
                symbol: new SimpleLineSymbol({
                    color: [0, 255, 0],
                    width: 2
                }),
                attributes: {
                    destination: route.attributes.name
                }
            });
            console.log("Adding route graphic:", graphic);
            return graphic;
        });
        routeGraphics.forEach(graphic => this.graphicsLayer.add(graphic));
    }

    displayFacilities(routes: __esri.Graphic[], facilities: __esri.Graphic[]) {
        const facilityNames = facilities.map(facility => facility.attributes.name);
        this.updateRightPanel(facilityNames);
    }

    updateRightPanel(facilityNames: string[]) {
        this.facilityNames = facilityNames;
    }

    clearExistingFacilities() {
        this.graphicsLayer.removeAll();
        this.facilityNames = [];
        this.updateRightPanel(this.facilityNames);
    }

    onRowClick(name: string) {
        this.clearHighlight();

        const routeGraphic = this.graphicsLayer.graphics.find(graphic => {
            console.log("graphic:", graphic);
            return graphic.geometry.type === 'polyline' &&
                graphic.attributes &&
                graphic.attributes.destination === name;
        });
        console.log("graphic.attributes.destination:", name);
        console.log("routeGraphic:", this.graphicsLayer.graphics);
        console.log("routeGraphic:", routeGraphic);

        if (routeGraphic) {
            routeGraphic.symbol = new SimpleLineSymbol({
                color: new Color([255, 0, 0]),
                width: 4
            });

            this.graphicsLayer.removeAll();
            this.graphicsLayer.add(routeGraphic);
        }

        // Highlight panel 
        const cityNameElement = document.querySelector(`li[data-abbreviation="${name}"]`);
        if (cityNameElement) {
            cityNameElement.classList.add('highlighted-city');
        }
    }

    clearHighlight() {
        this.graphicsLayer.graphics.forEach(graphic => {
            if (graphic.geometry.type === 'polyline' && graphic.symbol) {
                graphic.symbol = new SimpleLineSymbol({
                    color: new Color([255, 0, 0]),
                    width: 2
                });
            }
        });

        const highlightedCities = document.querySelectorAll('.highlighted-city');
        highlightedCities.forEach(city => city.classList.remove('highlighted-city'));
    }

}
