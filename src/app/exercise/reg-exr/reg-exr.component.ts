import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CustomPoint } from './custom-point';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';

@Component({
  selector: 'app-reg-exr',
  templateUrl: './reg-exr.component.html',
  styleUrls: ['./reg-exr.component.scss']
})
export class RegExrComponent implements OnInit {
  @Input() formTitle: string = 'Locator';
  @Output() locate = new EventEmitter<CustomPoint>();
  @ViewChild('mapPanel', { static: true }) mapPanel!: ElementRef;

  selectedPoint?: CustomPoint;
  map: Map | null = null;
  mapView: MapView | null = null;
  private graphicLayer: GraphicsLayer | undefined;
  private isUpdating = false;

  latitude?: number;
  longitude?: number;

  ngOnInit() {
    this.initializeMap();
  }

  initializeMap() {
    this.map = new Map({ basemap: 'topo-vector' });
    this.mapView = new MapView({
      container: this.mapPanel.nativeElement,
      map: this.map,
      center: [100.54360392621737, 13.70302868980819],
      zoom: 15
    });

    this.graphicLayer = new GraphicsLayer();
    this.map.add(this.graphicLayer);

    const mapImageLayer = new MapImageLayer({
      url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer'
    });
    this.map.add(mapImageLayer);

    this.mapView.on('click', (event) => this.executeIdentify(event));
  }

  checkCoordinates(latitude: number | undefined, longitude: number | undefined): boolean {
    if (latitude === undefined || longitude === undefined) {
      console.log('Latitude หรือ Longitude เป็น undefined');
      return false;
    }
  
    const latLongRegex = /^(\+|\-)?([5-9](\.\d+)?|1[0-9](\.\d+)?|20(\.0+)?)\,(\+|\-)?(9[7-9](\.\d+)?|10[0-4](\.\d+)?)$/;
    const coordinateString = `${latitude},${longitude}`;
    
    if (!latLongRegex.test(coordinateString)) {
      console.log('Latitude และ Longitude ไม่ถูกต้อง');
      return false;
    }
    console.log('Latitude และ Longitude ถูกต้อง');
    return true;
  }
  
  onLocate() {
    if (this.latitude !== undefined && this.longitude !== undefined) {
      if (this.checkCoordinates(this.latitude, this.longitude)) {
        const point = new CustomPoint(this.latitude, this.longitude);
        this.selectedPoint = point;
        this.locate.emit(point);
        this.updateMapView(point);
      } else {
        alert('กรุณากรอก Latitude และ Longitude ที่ถูกต้อง');
      }
    }
  }
  

  private async updateMapView(point: CustomPoint) {
    if (this.isUpdating) return;

    try {
      this.isUpdating = true;
      this.graphicLayer?.graphics.removeAll();

      const graphic = new Graphic({
        geometry: new Point({ longitude: point.longitude!, latitude: point.latitude! }),
        symbol: new SimpleMarkerSymbol({
          color: 'red',
          size: '8px',
          outline: { color: 'white', width: 1 }
        })
      });

      this.graphicLayer?.graphics.add(graphic);
      await this.mapView?.goTo({ center: [point.longitude!, point.latitude!], zoom: 15 });
    } finally {
      this.isUpdating = false;
    }
  }

  private async executeIdentify(event: any) {
    const coords = event.mapPoint;
    this.selectedPoint = new CustomPoint(coords.latitude, coords.longitude);
    this.latitude = coords.latitude;
    this.longitude = coords.longitude;

    // แสดงค่า latitude และ longitude ใน Console
    console.log('Latitude:', this.latitude, 'Longitude:', this.longitude);

  }
}
