type ProductTest = {
    code: string
    name: string
    category: string
    quantity: string
}

type HomeMenuItem = {
    id: number
    name: string
}

type Assignment1StateInfo = {
    state_abbr: string
    state_name: string
    sub_region: string
    rawData: __esri.Graphic
}


type Assignment2SpatialResultInfo = {
    areaname: string
    capital: string
    class: string
    objectid: number
    pop2000: number
    st: string
    rawData: __esri.Graphic
    routeGeometry: __esri.Geometry
}


type Assignment4DirectionInfo = {
    length: number | null
    maneuverType: string | null
    text: string
    displayText: string
    rawData: __esri.Graphic
}
