/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var Forestland = /* color: #008000 */ee.Geometry.MultiPoint(),
    Grassland = /* color: #00ff00 */ee.Geometry.MultiPoint(),
    Cropland = /* color: #ffff00 */ee.Geometry.MultiPoint(),
    Wetland = /* color: #0000ff */ee.Geometry.MultiPoint(),
    Settlement = /* color: #ff0000 */ee.Geometry.MultiPoint(),
    Otherland = /* color: #ff9f32 */ee.Geometry.MultiPoint(),
    TZ = ee.FeatureCollection("users/firsake/TZA_adm0");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
///////////////////////////////////////////
var img;
var imgList = [];
var imgListName = [];
var roiCountry = TZ;
///////////////////////////////////////////

var makeLegendEntry = function(color, name) {
  var colorBox = ui.Label({
    style: {
      backgroundColor: color,
      padding: '8px',
      margin: '0 0 4px 0',
    }
  });
  var description = ui.Label({
    value: name,
    style: {margin: '0 0 4px 6px'}
  });

  return ui.Panel({
    widgets: [colorBox, description],
    layout: ui.Panel.Layout.Flow('horizontal'),
  });
}


var makeLegend = function(title, colors) {
  var legend = ui.Panel({
    style: {
      position: 'bottom-left',
      padding: '8px 15px'
    }
  })
  
  var lgt = ui.Label({
    value: title,
    style: {
      fontWeight: 'bold',
      fontSize: '18px',
      margin: '0 0 4px 0',
      padding: '0'
    }
  })
  
  legend.add(lgt)

  for (var k in colors) {
    legend.add(makeLegendEntry(colors[k], k))
  }

  return legend
}

var buildColorPalette = function(colors) {
  var c = []
  for (var k in colors) {
    c.push(colors[k])
  }
  return c.join(',')
}

var rcmrdLandCovers = {
  'NoData'      : 'gray',
  'Forestland'  : 'darkgreen',
  'Grassland'   : 'lime',
  'Cropland'    : 'yellow',
  'Wetland'     : 'blue',
  'Settlement'  : 'red',
  'Otherland'   : 'orange'
}


var paletteS1 = buildColorPalette(rcmrdLandCovers)
var visS1 = {min: 0, max: 6, palette: paletteS1}

var servir = ee.FeatureCollection('users/yang/GEETables/SERVIR/east_africa_countries')
var countryName = 'Tanzania'
var country = servir.filter(ee.Filter.inList('Name', [countryName])).geometry()

var getSegmentLandcover = function(region, stack, year) {
  var epoch = ee.Date('1970-01-01').millis()
  var DAYS = 719529  
  
  var timeT = ee.Date.fromYMD(year, 1, 1).millis().subtract(epoch).divide(24*60*60*1000).add(DAYS)

  var tstart = ee.ImageCollection('projects/LCMS/SERVIR_CCDC')
                  .filterBounds(region)
                  .mosaic()
                  .select('.*tStart')
                  .toArray()

  var collection = stack.unmask().toArray()

  var vic = tstart.lte(timeT).and(tstart.gt(0))

  var lc = collection.arrayMask(vic).arraySlice(0, -1).arrayProject([0]).arrayFlatten([['landcover']])

  return lc.byte()
}

var getRcmrdLandcover = function(region, year) {
  var stack = ee.Image('projects/LCMS/SERVIR_PRODUCTS/' + countryName + '_STEM_Landcover_Mode')                    
  return getSegmentLandcover(region, stack, year)
}

var drawReference = function() {
  var lc2000s1 = ee.Image("users/yang/EastAfrica/Tanzania_Landcover_2000_Scheme_I").rename('landcover')
  var lc2010s1 = ee.Image('users/yang/EastAfrica/Tanzania_Landcover_2010_Scheme_I').rename('landcover')

  Map.addLayer(lc2000s1, visS1, 'RCMRD 2000', false)
  Map.addLayer(lc2010s1, visS1, 'RCMRD 2010', false)
}

/************* Main Application Object *****************/

var app = {}

app.initialize = function() {
  app.asset_dir = 'projects/LCMS/SERVIR_LANDCOVER/'
  
  app.SECTION_STYLE = {margin: '20px 0 0 0'};
  
  app.HELPER_TEXT_STYLE = {
      margin: '8px 0 -3px 8px',
      fontSize: '12px',
      color: 'gray'
  };
  
  app.OPTIONS = [
    {
      label: "RCMRD Scheme I",
      value: {
        asset: getRcmrdLandcover,
        legends: rcmrdLandCovers
      }
    }
  ]
  
  app.years = function() {
    var vals = []
    for (var y = 2018; y >= 2000; y--) {
      vals.push({label: ''+y, value: ''+y})
    }
    return vals
  }
  
  app.mapSet = null
  app.currentYear = 2018
}

app.createPanels = function() {
  app.intro = {
    panel: ui.Panel([
      ui.Label({
        value: countryName,
        style: {fontWeight: 'bold', fontSize: '24px', margin: '10px 5px'}
      }),
      ui.Label(' Land Cover Viewer')
    ])
  };
  
  app.LandcoverPicker = {
    select: ui.Select({
      items: app.OPTIONS,
      placeholder: 'Select Classification',
      onChange: app.refreshMapset
    })
  }
  
  app.LandcoverPicker.panel = ui.Panel({
    widgets: [
      ui.Label('Classification', {fontWeight: 'bold'}),
      ui.Panel([
        app.LandcoverPicker.select
      ])
    ],
    style: app.SECTION_STYLE
  })

  app.YearPicker = {
    select: ui.Select({
      items: app.years() ,
      placeholder: 'Select Year',
      onChange: app.refreshMapYear
    })
  }
  
  app.YearPicker.panel = ui.Panel({
    widgets: [
      ui.Label('Year', {fontWeight: 'bold'}),
      ui.Panel([
        app.YearPicker.select
      ])
    ],
    style: app.SECTION_STYLE
  })
  
  app.legend = ui.Panel()

/////////////////////////////////////////////////////////////////////////////  
  app.Downloader = {
    button: ui.Button({
      label: 'Export the current image to Drive',
      style: {textAlign:'center', stretch:'horizontal'},
      onClick: exportn
    })
  }
  
  app.Downloader.panel = ui.Panel({
    widgets: [
      ui.Label('Download Image', {fontWeight: 'bold'}),
      ui.Panel([
        app.Downloader.button
      ])
    ],
    style: app.SECTION_STYLE
  })
////////////////////////////////////////////////////////////////////////////
}

app.createHelper = function() {
  app.refreshMapset = function() {
    app.mapSet = app.LandcoverPicker.select.getValue()
    
    app.legend.clear()
    app.legend.add(makeLegend('Legend', app.mapSet.legends))
    
    Map.clear()
    app.YearPicker.select.setValue(null)
  }
  
  //load the selected classification year
  app.refreshMapYear = function() {
    Map.clear()
    
    app.currentYear = app.YearPicker.select.getValue()
    
    if (!app.currentYear) {
      return;
    }
    
    for (var i = 0; i < 2; i++) {
      if (app.currentYear - i * 2 < 2000) {
        continue;
      }
      
      //////////////////////////////////////////////////////////////////////
      img = app.mapSet.asset(country, app.currentYear - i*2)
      
      imgList.push(img);
      
      /////////////////////////////////////////////////////////////////////
      
      var vis = {min: 0, max: Object.keys(app.mapSet.legends).length-1, palette: buildColorPalette(app.mapSet.legends)}
      Map.addLayer(img, vis, 'Mapped: ' + (app.currentYear-i*2))
      
      imgListName.push('Mapped_' + (app.currentYear-i*2) + "_" + countryName);
      
    }
    
    drawReference()
  }
}

app.boot = function() {
  app.initialize()
  app.createHelper()
  app.createPanels()
  
  var main = ui.Panel({
    widgets: [
      app.intro.panel,
      app.LandcoverPicker.panel,
      app.YearPicker.panel,
      app.legend,
      app.Downloader.panel
    ],
    style: {width: '320px', padding: '8px'}
  })
  
  ui.root.insert(0, main)
}


app.boot()

Map.centerObject(ee.Geometry.Point([34.727, -6.043]), 6)


function exportn(){
  
  for(var x = 0; x < imgList.length; x++ ){
    
        Export.image.toDrive({
                              image: imgList[x], 
                              description: imgListName[x], 
                              region:roiCountry,
                              maxPixels: 1e13,
                              scale: 30,
                              crs: "EPSG:4326"
                          });
                          
  }
  
}
