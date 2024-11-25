import { LoadingService } from './../../services/loading.service'
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import MapImageLayer from '@arcgis/core/layers/MapImageLayer'
import * as urlUtils from '@arcgis/core/core/urlUtils'
import IdentityManager from '@arcgis/core/identity/IdentityManager'
import ServerInfo from '@arcgis/core/identity/ServerInfo'
import { FormGroup,FormControl } from '@angular/forms'
import LayerList from '@arcgis/core/widgets/LayerList'

@Component({
    selector: 'app-assignment7',
    templateUrl: './assignment7.component.html',
    styleUrls: ['./assignment7.component.scss'],
})
export class Assignment7Component implements OnInit {
    @ViewChild('mapContainer', { static: true })
    mapContainer!: ElementRef<HTMLDivElement>
    view!: __esri.MapView

    countDownTimer: number = 0

    constructor(private loadingService: LoadingService) {
    
    }

    ngOnInit(): void {
        this.init()
    }

    async init() {
        //this.addProxyPageConfig();

        await this.registerToken();
        const initConfig = { center: [100.5433989, 13.7029924], zoom: 14 }
        const securedMapLayer = new MapImageLayer({
            url: 'https://gisadaptordev.mea.or.th/mapstd/rest/services/rep/MEAREP_ELEC/MapServer'
        })
        const map = new Map({
            basemap: 'topo-vector',
            layers: [securedMapLayer]
        })
        this.view = new MapView({
            container: this.mapContainer.nativeElement,
            map: map,
            ...initConfig,
        })

        this.view.when(() => {})
    }

    addProxyPageConfig() {
        urlUtils.addProxyRule({
            urlPrefix: 'https://gisadaptordev.mea.or.th/mapstd',
            proxyUrl: 'https://workforce.cdg.co.th/mea-workforce-proxy/api/appproxy',
        })
    }
  
    registerToken(){
 
        const promise = new Promise((resolve)=>{
            const mapUrl = `https://gisadaptordev.mea.or.th/mapstd`
 
            const serverInfo = new ServerInfo({
                tokenServiceUrl: mapUrl + '/tokens/generateToken',
                hasServer: true,
                shortLivedTokenValidity: 60 //Max Minutes
            })
 
            IdentityManager.generateToken(serverInfo, {
                username: 'meaworkforce',
                password: 'meaworkforce123',
            }).then((res)=>{
                console.log('Register New Token');
                console.log(res);
 
                IdentityManager.registerToken({
                    server: mapUrl + '/rest/services',
                    token: res.token,
                    expires: res.expires,
                })
 
                resolve(null);
            })
        })
 
        return promise;
    }

    calDisplayInMinute(){
        const min = Math.floor(this.countDownTimer / 60000);
        const sec = (this.countDownTimer % 60000) / 1000;
        return ("0" + min).slice(-2) + ':' + ("0" + sec).slice(-2)
    }
}
