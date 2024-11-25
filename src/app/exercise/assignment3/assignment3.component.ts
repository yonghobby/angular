import { LoadingService } from './../../services/loading.service'
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Sketch from '@arcgis/core/widgets/Sketch'
import Graphic from '@arcgis/core/Graphic';

@Component({
    selector: 'app-assignment3',
    templateUrl: './assignment3.component.html',
    styleUrls: ['./assignment3.component.scss'],
})
export class Assignment3Component implements OnInit {
    @ViewChild('mapContainer', { static: true })
    mapContainer!: ElementRef<HTMLDivElement>
    view!: __esri.MapView
    applyEditLayer!: __esri.FeatureLayer
    grpDrawLayer!: __esri.GraphicsLayer
    sketch!: Sketch

    constructor(private loadingService: LoadingService) {}

    ngOnInit(): void {
        const initConfig = { center: [-116.5925, 34.40333], zoom: 11 }

        this.applyEditLayer = new FeatureLayer({
            id: 'applyEditLayer',
            url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire/FeatureServer/2',
        })
        this.grpDrawLayer = new GraphicsLayer({ id: 'grpDrawLayer' })
  
        const map = new Map({
            basemap: 'topo-vector',
            layers: [this.applyEditLayer, this.grpDrawLayer]
        })
        this.view = new MapView({
            container: this.mapContainer.nativeElement,
            map: map,
            ...initConfig,
        })

        this.view.when(() => {
            this.loadingService.hideLoading()
            this.sketch = new Sketch({
                layer: this.grpDrawLayer,
                view: this.view,
                availableCreateTools: ['polygon']
            })

            this.sketch.on('create', this.onSketchCreate.bind(this));
            this.sketch.on('update', this.onSketchUpdate.bind(this));
            this.sketch.on('delete', this.onSketchDelete.bind(this));
            this.view.ui.add(this.sketch,'top-right');
        })

        this.view.on('click', (evt: __esri.ViewClickEvent)=>{
            this.view.hitTest(evt).then((response:__esri.HitTestResult)=>{
                console.log(response,'response')
                if(response.results.length > 0){
                    // let findGraphic = null;
                    // for (let i = 0; i < response.results.length; i++){
                    //     const result = response.results[i] as __esri.GraphicHit
                    //     if(result.layer.id === 'applyEditLayer'){
                    //         findGraphic = result.graphic;
                    //         break;
                    //     }
                    // }

                    const findResult = response.results.find((result)=> result.layer.id === 'applyEditLayer') as __esri.GraphicHit;
                    if(findResult){
                        this.activateUpdateSketch(findResult.graphic);
                    }
                }
            })
        })

    }

    activateUpdateSketch(graphic: Graphic){
        
        this.grpDrawLayer.add(graphic);
        // graphic.symbol =  new SimpleFillSymbol({
        //     color: [255, 0, 255, 0.5],
        //     outline: {
        //         color: [50, 50, 50],
        //         width: 2,
        //     },
        // })
        this.sketch.update([graphic]);
    }

    onSketchCreate(event: __esri.SketchCreateEvent){
        if(event.state === 'complete'){
            console.log('state complete',event)

            const addFeature = event.graphic;
            addFeature.attributes = {
                symbolid : 0
            } 

            this.loadingService.showLoading();
            this.applyEditLayer.applyEdits({
                addFeatures: [addFeature]
            }).then((response: __esri.EditsResult)=>{
                console.log('response',response)
                this.grpDrawLayer.removeAll();
            }).finally(()=>{
                this.loadingService.hideLoading();
            })
        }
    }

    onSketchUpdate(event: __esri.SketchUpdateEvent){
        if(event.state === 'complete' && !event.aborted){
            const upadateFeature = event.graphics
            console.log('upadateFeature', upadateFeature); //ต้องมี attributes objectid / OBJECTID
            this.loadingService.showLoading();
            this.applyEditLayer
            .applyEdits({
                updateFeatures: upadateFeature
            })
            .then((response: __esri.EditsResult)=>{
                console.log('response',response)
                this.grpDrawLayer.removeAll();
            })
            .finally(()=>{
                this.loadingService.hideLoading();
            })
        }
    }

    onSketchDelete(event: __esri.SketchDeleteEvent){
        console.log('delete event', event)
        this.loadingService.showLoading();
        this.applyEditLayer
        .applyEdits({
            deleteFeatures: event.graphics
        })
        .then((response: __esri.EditsResult)=>{
            this.grpDrawLayer.removeAll();
        })
        .finally(()=>{
            this.loadingService.hideLoading();
        })
    }
}
