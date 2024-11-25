import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Graphic from '@arcgis/core/Graphic';
import Polygon from '@arcgis/core/geometry/Polygon';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';

@Component({
  selector: 'app-intermediate1',
  templateUrl: './intermediate1.component.html',
  styleUrls: ['./intermediate1.component.scss']
})
export class Intermediate1Component implements OnInit{
  @ViewChild('mapPanel', { static: true }) mapPanel!: ElementRef;
  states: Array<any> = [];
  selectedState: any;
  map: Map | null = null;
  mapView: MapView | null = null;

  ngOnInit() {
    this.map = new Map({ basemap: 'topo-vector' });

    this.mapView = new MapView({
      container: this.mapPanel.nativeElement,
      map: this.map,
      center: [-98.583333, 39.8283],
      zoom: 4
    });

    const featureLayer = new FeatureLayer({
      url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/2'
    });
    this.map.add(featureLayer);

    this.queryStates(featureLayer);
  }

  private queryStates(featureLayer: FeatureLayer) {
    const query = featureLayer.createQuery();
    query.where = '1=1';
    query.outFields = ['*'];
    query.returnGeometry = true;

    featureLayer.queryFeatures(query).then(response => {
      this.states = response.features.map(feature => ({
        name: feature.attributes.state_name,
        subregion: feature.attributes.sub_region,
        abbreviation: feature.attributes.state_abbr,
        geometry: feature.geometry 
      }));
    });
  }

  onRowClick(stateAbbreviation: string) {
    this.states.forEach(state => state.isHighlighted = false);
    // this.selectedState.isHighlighted = false
    const selectedState = this.states.find(state => state.abbreviation === stateAbbreviation);

    if (selectedState && selectedState.geometry) {
      selectedState.isHighlighted = true;
      this.addPolygonToMap(selectedState.geometry);
      this.zoomToState(selectedState.geometry);
    }
  }

  addPolygonToMap(geometry: Polygon) {
    const polygonGraphic = new Graphic({
      geometry: geometry,
      symbol: new SimpleFillSymbol({
        color: [232, 143, 79, 0.5],
        outline: {
          color: [232, 143, 79],
          width: 2
        }
      })
    });

    this.mapView?.graphics.removeAll();
    this.mapView?.graphics.add(polygonGraphic);
  }

  zoomToState(geometry: Polygon) {
    this.mapView?.goTo({
      target: geometry,
      zoom: 6
    });
  }
}
