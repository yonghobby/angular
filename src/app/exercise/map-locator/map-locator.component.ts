import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel';
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine';
import { Geometry } from '@arcgis/core/geometry';
import Polyline from "@arcgis/core/geometry/Polyline";
import Polygon from "@arcgis/core/geometry/Polygon";
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol';
import { fakeAsync } from '@angular/core/testing';

@Component({
  selector: 'app-map-locator',
  templateUrl: './map-locator.component.html',
  styleUrls: ['./map-locator.component.scss']
})
export class MapLocatorComponent implements OnInit {
  @ViewChild('mapPanel', { static: true }) mapPanel!: ElementRef;
  map: Map | null = null;
  mapView: MapView | null = null;
  graphicsLayer: GraphicsLayer | null = null;
  sketchViewModel: SketchViewModel | null = null;
  mode: 'distance' | 'coordinates' | 'area' = 'coordinates';
  selectedDistanceUnit: 'เมตร' | 'กิโลเมตร' = 'เมตร';
  distanceUnits = [
    { label: 'Meters', value: 'meters' },
    { label: 'Kilometers', value: 'kilometers' }
  ];
  selectedAreaUnit: 'square-meters' | 'square-kilometers' | 'rai' = 'square-meters';
  areaUnits = [
    { label: 'Square Meters', value: 'square-meters' },
    { label: 'Square Kilometers', value: 'square-kilometers' },
    { label: 'Rai', value: 'rai' }
  ];

  latitudeClick?: number;
  longitudeClick?: number;
  latitudeMouse?: number;
  longitudeMouse?: number;
  formTitle: string = 'Locator';
  distanceResult: number | null = null;
  areaResult: string | null = null;

  ngOnInit() {
    this.initializeMap();
    this.initializeSketchViewModel();
  }

  initializeMap() {
    this.map = new Map({ basemap: 'topo-vector' });
    this.mapView = new MapView({
      container: this.mapPanel.nativeElement,
      map: this.map,
      center: [-117.23502, 34.23911], //-117.23502, 34.23911    100.54360392621737, 13.70302868980819
      zoom: 15
    });

    this.graphicsLayer = new GraphicsLayer();
    this.map.add(this.graphicsLayer);

    this.mapView.on('click', (event) => {
      const mapPoint = this.mapView?.toMap(event);
      if (mapPoint) {
        const isInvalid = this.checkCoordinates(mapPoint.latitude, mapPoint.longitude);
        if (isInvalid) {
          this.latitudeClick = mapPoint.latitude;
          this.longitudeClick = mapPoint.longitude;

          const pointGraphic = new Graphic({
            geometry: new Point({
              x: this.longitudeClick,
              y: this.latitudeClick,
              spatialReference: { wkid: 4326 }
            }),
            symbol: new PictureMarkerSymbol({
              url: 'assets/images/location.png',
              width: '50px',
              height: '50px',
              yoffset: "17px"
            })
          });
  
          this.graphicsLayer?.removeAll();
          this.graphicsLayer?.add(pointGraphic);
        }
      }
    });

    this.mapView.on('pointer-move', (event) => {
      if (this.mode === 'coordinates' && this.mapView) {
        const mapPoint = this.mapView.toMap(event);
        this.latitudeMouse = mapPoint.latitude;
        this.longitudeMouse = mapPoint.longitude;
      }
    });
  }

  checkCoordinates(latitude: number, longitude: number): boolean {
    //const latitudeRegex = /^([5-9]|1[0-9]|20)(\.\d+)?$/;
    //const longitudeRegex = /^(97|98|99|100|101|102|103|104|105)(\.\d+)?$/;
    const latLongRegex = /^(\+|\-)?([5-9](\.\d+)?|1[0-9](\.\d+)?|20(\.0+)?)\,(\+|\-)?(9[7-9](\.\d+)?|10[0-4](\.\d+)?)$/;
    const coordinateString = `${latitude},${longitude}`;
    // if (!latitudeRegex.test(latitude.toString())) {
    //   console.log('Latitude ไม่ถูกต้อง');
    //   return false;
    // }
  
    // if (!longitudeRegex.test(longitude.toString())) {
    //   console.log('Longitude ไม่ถูกต้อง');
    //   return false;
    // }
  
    if (!latLongRegex.test(coordinateString)) {
      console.log('Latitude และ Longitude ไม่ถูกต้อง');
      return false;
    }
    console.log('Latitude และ Longitude ถูกต้อง');
    return true
  }

  initializeSketchViewModel() {
    this.sketchViewModel = new SketchViewModel({
      view: this.mapView!,
      layer: this.graphicsLayer!,
      polygonSymbol: {
        type: "simple-fill",
        color: [255, 255, 255, 0.5],
        outline: { color: [0, 0, 0, 1], width: 1 }
      },
      polylineSymbol: {
        type: "simple-line",
        color: [255, 0, 0, 1],
        width: 2
      }
    });
  
    this.sketchViewModel.on("create", (event) => {
      if (event.state === "complete") {
        if (this.mode === 'distance') {
          this.calculateDistance(event.graphic.geometry as Polyline);
        } else if (this.mode === 'area') {
          this.calculateArea(event.graphic.geometry as Polygon); 
        }
      }
    });
  }

  calculateDistance(geometry: Polyline) {
    const unit = this.selectedDistanceUnit === 'กิโลเมตร' ? 'kilometers' : 'meters';
    const distance = geometryEngine.geodesicLength(geometry, unit);
    this.distanceResult = this.selectedDistanceUnit === 'กิโลเมตร' ? parseFloat(distance.toFixed(2)) : distance;
  }
  
  calculateArea(geometry: Polygon) {
    let areaInSquareMeters = geometryEngine.geodesicArea(geometry, "square-meters");
  
    switch (this.selectedAreaUnit) {
      case 'square-kilometers':
        this.areaResult = (areaInSquareMeters / 1e6).toFixed(2); // 1 km² = 1,000,000 m²
        break;
      case 'rai':
        const rai = Math.floor(areaInSquareMeters / 1600);
        const remainingForNgarn = areaInSquareMeters % 1600;
        const ngarn = Math.floor(remainingForNgarn / 400);
        const remainingForWah = remainingForNgarn % 400;
        const wah = Math.floor(remainingForWah / 4);
        this.areaResult = `${rai} ไร่ ${ngarn} งาน ${wah} ตารางวา`;
        console.log('rai',this.areaResult)
        break;
      default:
        this.areaResult = areaInSquareMeters.toFixed(2);
    }
  }

  setMode(selectedMode: 'distance' | 'coordinates' | 'area') {
    this.mode = selectedMode;
    this.latitudeClick = undefined;
    this.longitudeClick = undefined;
    this.latitudeMouse = undefined;
    this.longitudeMouse = undefined;
    this.distanceResult = null;
    this.areaResult = null;
    this.selectedDistanceUnit = 'เมตร';
    this.selectedAreaUnit = 'square-meters';

    if (this.mode === 'distance') {
      this.graphicsLayer?.removeAll();
      this.formTitle = 'Distance Measurement';
      this.sketchViewModel?.create("polyline");
    } else if (this.mode === 'area') {
      this.graphicsLayer?.removeAll();
      this.formTitle = 'Area Measurement';
      this.sketchViewModel?.create("polygon");
    } else {
      this.formTitle = 'Locator';
      this.sketchViewModel?.cancel();
      this.graphicsLayer?.removeAll();
    }
  }

  onUnitChange(event: any) {
    this.selectedDistanceUnit = event.value;
    this.selectedAreaUnit = event.value;
    if (this.mode === 'distance' && this.distanceResult) {
      const lastGeometry = this.graphicsLayer?.graphics.getItemAt(0)?.geometry as Polyline;
      if (lastGeometry) {
        this.calculateDistance(lastGeometry);
      }
    }
    if (this.mode === 'area' && this.areaResult) {
      const lastGeometry = this.graphicsLayer?.graphics.getItemAt(0)?.geometry as Polygon;
      if (lastGeometry) {
        this.calculateArea(lastGeometry);
      }
    }
  }
}
