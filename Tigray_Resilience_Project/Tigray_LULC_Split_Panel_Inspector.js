/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var L8_imageCollection = ee.ImageCollection("LANDSAT/LC08/C01/T1_SR"),
    L4_imageCollection = ee.ImageCollection("LANDSAT/LT04/C01/T1_SR"),
    L5_imageCollection = ee.ImageCollection("LANDSAT/LT05/C01/T1_SR"),
    L7_imageCollection = ee.ImageCollection("LANDSAT/LE07/C01/T1_SR"),
    S2_imageCollection = ee.ImageCollection("COPERNICUS/S2"),
    projects = ee.FeatureCollection("users/firsake/Tigray/Tigray_Activities"),
    roi = ee.FeatureCollection("users/firsake/Tigray/Tigray_Ethiopia"),
    srtm_30 = ee.Image("USGS/SRTMGL1_003");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var leftMap = ui.Map(); //hold the data
var rightMap = ui.Map(); //show satellite equivalent
//rightMap.setControlVisibility();
leftMap.setControlVisibility(false, true, false, false, false, false);
rightMap.setControlVisibility(false, false, false, false, false, false);
rightMap.setOptions('SATELLITE');
rightMap.addLayer(ee.Image().paint(roi, 0, 2), null, null);

leftMap.centerObject(roi,8);

var loc = "Tigray";
var collection;
var composite;
var finalImage;



var images = [
                "SELECT",
                "Landsat 8",
                "Landsat 7",
                "Landsat 5",
                "Landsat 4",
                "Sentinel 2"
              ];
              
var images_code = [
                "L8",
                "L7",
                "L5",
                "L4",
                "S2",
                "DEM"
              ];
              
var prefixImage = ["L8","L7","L5", "L4", "S2", "DEM"];

var imagesCollection = [
                        L8_imageCollection,
                        L7_imageCollection,
                        L5_imageCollection,
                        L4_imageCollection,
                        S2_imageCollection
                        ];
                        
var cloudProperty = [
                      "CLOUD_COVER_LAND",
                      "CLOUD_COVER_LAND",
                      "CLOUD_COVER_LAND",
                      "CLOUD_COVER_LAND",
                      "CLOUDY_PIXEL_PERCENTAGE"
                    ];

var bandColors = [
                        "Natural Color",
                        "False Color Infrared (Vegetation)",
                        "False Color (Urban)",
                        "Agriculture",
                        "Atmospheric Penetration",
                        "Healthy Vegetation",
                        "Land/Water",
                        "Natural Color with Atmospheric Removal",
                        "Shortwave Infrared",
                        "Vegetation Analysis"
                      ];
                      
var enhancer = [
                  'NONE',
                  'EQUALIZE',
                  'NORMALIZE'
                ];
                
var enhancer_code = ['nn','eq','nm'];
                      
var bandCombination_L754 = [
  
                        ['B3', 'B2', 'B1'],
                        ['B4', 'B3', 'B2'],
                        ['B7', 'B5', 'B3'],
                        ['B5', 'B4', 'B1'],
                        ['B7', 'B5', 'B4'],
                        ['B4', 'B5', 'B1'],
                        ['B4', 'B5', 'B3'],
                        ['B7', 'B4', 'B2'],
                        ['B7', 'B4', 'B3'],
                        ['B5', 'B4', 'B3']
                      ]; //source: http://web.pdx.edu/~emch/ip1/bandcombinations.html
                      
var bandCombination_L8 = [
                        ['B4', 'B3', 'B2'],
                        ['B5', 'B4', 'B3'],
                        ['B7', 'B6', 'B4'],
                        ['B6', 'B5', 'B2'],
                        ['B7', 'B6', 'B5'],
                        ['B5', 'B6', 'B2'],
                        ['B5', 'B6', 'B4'],
                        ['B7', 'B5', 'B3'],
                        ['B7', 'B5', 'B4'],
                        ['B6', 'B5', 'B4']
                      ];
                      
var bandCombination_S2 = [
                        ['B4', 'B3', 'B2'],
                        ['B8', 'B4', 'B3'],
                        ['B12', 'B11', 'B4'],
                        ['B11', 'B8', 'B2'],
                        ['B12', 'B11', 'B8a'],
                        ['B8', 'B11', 'B2'],
                        ['B8', 'B11', 'B4'],
                        ['B12', 'B8', 'B3'],
                        ['B12', 'B8', 'B4'],
                        ['B11', 'B8', 'B4']
                      ];              
                      
var bandCombinations = [
                        bandCombination_L8, 
                        bandCombination_L754,
                        bandCombination_L754,
                        bandCombination_L754,
                        bandCombination_S2
                      ];                      
                      

/*var start_date = [
                   '-01-01',
                   '-02-01',
                   '-03-01',
                   '-04-01',
                   '-05-01',
                   '-06-01',
                   '-07-01',
                   '-08-01',
                   '-09-01',
                   '-10-01',
                   '-11-01',
                   '-12-01',
                 ];

var end_date = [
                   '-01-31',
                   '-02-29',
                   '-03-31',
                   '-04-30',
                   '-05-31',
                   '-06-30',
                   '-07-31',
                   '-08-31',
                   '-09-30',
                   '-10-31',
                   '-11-30',
                   '-12-31',
                 ];


var monthNames = [
                  "SELECT",
                  "JANUARY", 
                  "FEBRUARY", 
                  "MARCH", 
                  "APRIL", 
                  "MAY", 
                  "JUNE", 
                  "JULY", 
                  "AUGUST", 
                  "SEPTEMBER", 
                  "OCTOBER", 
                  "NOVEMBER",
                  "DECEMBER"
                ];
                */
                





// Function to cloud mask from the pixel_qa band of Landsat 8 SR data.
function maskL8sr(image) {
  // Bits 3 and 5 are cloud shadow and cloud, respectively.
  var cloudShadowBitMask = 1 << 3;
  var cloudsBitMask = 1 << 5;

  // Get the pixel QA band.
  var qa = image.select('pixel_qa');

  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudShadowBitMask).eq(0)
      .and(qa.bitwiseAnd(cloudsBitMask).eq(0));

  // Return the masked image, scaled to TOA reflectance, without the QA bands.
  return image.updateMask(mask).divide(10000)
      .select("B[0-9]*")
      .copyProperties(image, ["system:time_start"]);
}

// Function to mask clouds using the Sentinel-2 QA band.
function maskS2clouds(image) {
  var qa = image.select('QA60');
  
  // Bits 10 and 11 are clouds and cirrus, respectively.
  var cloudBitMask = Math.pow(2, 10);
  var cirrusBitMask = Math.pow(2, 11);
  
  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0).and(
             qa.bitwiseAnd(cirrusBitMask).eq(0));

  // Return the masked and scaled data.
  return image.updateMask(mask).divide(10000);
}

// Function to cloud mask using the simple cloud score for non-SR
function maskL754(image) {
  // Compute a cloud score in [0, 100], low to high cloud score.
  var cloud = ee.Algorithms.Landsat.simpleCloudScore(image);
  
  // Create a cloud mask as a threshold of the cloud score.
  // For very cloudy places, this threshold and/or the 
  // length of the input series may need to be adjusted.
  var mask = cloud.select('cloud').lte(50);
  
  return image.updateMask(mask);
}


var cloudMasker = [maskL8sr,maskL8sr,maskL8sr,maskL8sr,maskS2clouds];


////////////////////////////
//later on for SLC - landsat 7

var MIN_SCALE = 1/3;
var MAX_SCALE = 3;
var MIN_NEIGHBORS = 144;

/* Apply the USGS L7 Phase-2 Gap filling protocol, using a single kernel size. */
var GapFill = function(src, fill, kernelSize) {
  var kernel = ee.Kernel.square(kernelSize * 30, "meters", false)
  
  // Find the pixels common to both scenes.
  var common = src.mask().and(fill.mask())
  var fc = fill.updateMask(common)
  var sc = src.updateMask(common)
  leftMap.addLayer(common.select(0).mask(common.select(0)), {palette:['000000']}, 'common mask (both exist)', false)

  // Find the primary scaling factors with a regression.
  // Interleave the bands for the regression.  This assumes the bands have the same names.
  var regress = fc.addBands(sc)

  regress = regress.select(regress.bandNames().sort())

  var ratio = 5

  var fit = regress
    .unmask() // avoid gaps
    .reduceResolution(ee.Reducer.max(), false, 500)
    .reproject(regress.select(0).projection().scale(ratio, ratio))
    .reduceNeighborhood(ee.Reducer.linearFit().forEach(src.bandNames()), kernel, null, false)
    .reproject(regress.select(0).projection().scale(ratio, ratio))

  var offset = fit.select(".*_offset")
  var scale = fit.select(".*_scale")

  leftMap.addLayer(scale.select('B1_scale'), {min:-2, max:2}, 'scale B1', false)
  
  // Find the secondary scaling factors using just means and stddev
  var reducer = ee.Reducer.mean().combine(ee.Reducer.stdDev(), null, true)
  var src_stats = src
    .reduceResolution(ee.Reducer.max(), false, 500)
    .reproject(regress.select(0).projection().scale(ratio, ratio))
    .reduceNeighborhood(reducer, kernel, null, false)
    .reproject(regress.select(0).projection().scale(ratio, ratio))
  
  var fill_stats = fill
    .reduceResolution(ee.Reducer.max(), false, 500)
    .reproject(regress.select(0).projection().scale(ratio, ratio))
    .reduceNeighborhood(reducer, kernel, null, false)
    .reproject(regress.select(0).projection().scale(ratio, ratio))
    
  var scale2 = src_stats.select(".*stdDev").divide(fill_stats.select(".*stdDev"))
  var offset2 = src_stats.select(".*mean").subtract(fill_stats.select(".*mean").multiply(scale2))

  var invalid = scale.lt(MIN_SCALE).or(scale.gt(MAX_SCALE))
  leftMap.addLayer(invalid.select(0).mask(invalid.select(0)), {palette:['550000']}, 'invalid1', false)
  scale = scale.where(invalid, scale2)
  offset = offset.where(invalid, offset2)

  // When all else fails, just use the difference of means as an offset.  
  var invalid2 = scale.lt(MIN_SCALE).or(scale.gt(MAX_SCALE))
  leftMap.addLayer(invalid2.select(0).mask(invalid2.select(0)), {palette:['552020']}, 'invalid2', false)
  scale = scale.where(invalid2, 1)
  offset = offset.where(invalid2, src_stats.select(".*mean").subtract(fill_stats.select(".*mean")))

  // Apply the scaling and mask off pixels that didn't have enough neighbors.
  var count = common.reduceNeighborhood(ee.Reducer.count(), kernel, null, true, "boxcar")
  var scaled = fill.multiply(scale).add(offset)
      .updateMask(count.gte(MIN_NEIGHBORS))

  return src.unmask(scaled, true)
}



//////////////////////////////





function processImage(v,w,x,y,z,c,l,m,a){


    collection = c
        .filterDate(x, y)
        .filterBounds(roi)
        .filter(ee.Filter.lt(l, z))//cloud pixel percentage allowance over land
        .map(m);//cloud masking
        
    composite = collection.median();
    finalImage = composite.clip(roi.geometry());
    
    var template_sld =
  '<RasterSymbolizer>' +
    '<ContrastEnhancement><_enhance_/></ContrastEnhancement>' +
    '<ChannelSelection>' +
      '<RedChannel>' +
        '<SourceChannelName>'+ w[0] +'</SourceChannelName>' +
      '</RedChannel>' +
      '<GreenChannel>' +
        '<SourceChannelName>'+ w[1] +'</SourceChannelName>' +
      '</GreenChannel>' +
      '<BlueChannel>' +
        '<SourceChannelName>'+ w[2] +'</SourceChannelName>' +
      '</BlueChannel>' +
    '</ChannelSelection>' +
  '</RasterSymbolizer>';
  
    var image = finalImage.multiply(255).byte();
    
    switch(a) {
        case 'eq':
          var equalize_sld = template_sld.replace('_enhance_', 'Histogram');
          leftMap.addLayer(image.sldStyle(equalize_sld), {}, v);
          break;
        case 'nm':
          var normalize_sld = template_sld.replace('_enhance_', 'Normalize');
          leftMap.addLayer(image.sldStyle(normalize_sld), {}, v);
          break;
        case 'nn':
          leftMap.addLayer(finalImage, {bands: w, min: 0, max: 0.3}, v);
          break;
        default:
          break;
    } 
    
    
   // var Spectral = ["9e0142", "d53e4f", "f46d43", "fdae61", "fee08b", "ffffbf"];//, "e6f598", "abdda4", "66c2a5", "3288bd", "5e4fa2"
   // leftMap.addLayer(ee.Image().int().paint(projects, 'AWARDS'), {palette: Spectral})
}
           

/////////////////////////////////////////////////////////////////////////////////////////////

                                
// Create a panel to hold our widgets.
var panel = ui.Panel();
panel.style().set('width', '300px');

// Create an intro panel with labels.
var intro = ui.Panel([
  ui.Label({
    value: 'Satellite Image Explorer',
    style: {fontSize: '20px', fontWeight: 'bold', color: '#003300',  textAlign: 'center',stretch: 'horizontal'}
  }),
  
  ui.Label(
    {
    value: loc + ' Region',
    style: {fontSize: '15px', fontWeight: 'bold', color: '#006600', textAlign: 'center',stretch: 'horizontal'}
    }
  )
]);
panel.add(intro);

var select_image = ui.Select({
  items: images,
  value: images[0],
  style: {textAlign:'center',stretch:'horizontal', margin:'10px'},
  onChange: redraw,
});

var chkDEM = ui.Checkbox({
  label: 'Elevation',
  value: false,
  style: {textAlign:'center',stretch:'horizontal', margin:'10px'},
  onChange: redraw
});

var lblYear = ui.Label(
  {
    value:'Year:',
    style: {fontSize: '12px', fontWeight: 'bold', color: '#8f3334', textAlign: 'left' ,stretch: 'horizontal', padding:'10px'}
  }
);

var sldYear = ui.Slider({
  min: 1982,
  max: 2018,
  value: 2018,
  step: 1,
  style: {textAlign:'center',stretch:'horizontal', margin:'10px'},
  onChange: redraw
});


/*var select_month = ui.Select({
  items: monthNames,
  value: monthNames[0],
  style: {textAlign:'center',stretch:'horizontal', margin:'10px'},
  onChange: redraw,
});*/


var lblCloud = ui.Label(
  {
    value:'Cloud Threshold:',
    style: {fontSize: '12px', fontWeight: 'bold', color: '#8f3334', textAlign: 'left' ,stretch: 'horizontal', padding:'10px'}
  }
);

var sldCloud = ui.Slider({
  min: 0,
  max: 100,
  value: 50,
  step: 1,
  style: {textAlign:'center',stretch:'horizontal', margin:'10px'},
  onChange: redraw
});


var select_color = ui.Select({
  items: bandColors,
  value: bandColors[0],
  style: {textAlign:'center',stretch:'horizontal', margin:'10px'},
  onChange: redraw,
});


var select_enhancer = ui.Select({
  items: enhancer,
  value: enhancer[0],
  style: {textAlign:'center',stretch:'horizontal', margin:'10px'},
  onChange: redraw,
});


var exporta = ui.Button({
      label: 'Export the current image to Drive',
      style: {textAlign:'center', stretch:'horizontal'},
      
      onClick: function() {
        var d = new Date();
        var n = d.getTime();
        
        var im2 = select_image.getValue();
        var imI2 = images.indexOf(im2) - 1;
        var imCode = images_code[imI2];
        
        
        var image_name = loc + "_" + imCode  + "_YR_" + sldYear.getValue()  + "_cloud_" + sldCloud.getValue() + "_" + n;
        
        if (select_image.getValue() == 'SELECT'){
          
          print ("Please select the year first");
          
        }else{
            
              Export.image.toDrive({
                                    image: finalImage, 
                                    description: image_name, 
                                    maxPixels: 1e13,
                                    region:roi.geometry().bounds(),
                                    scale: 30, 
                                    crs: "EPSG:4326"
                                });
                                
        }
        
      }
});

panel.add(ui.Label('Satellite Image:')).add(select_image);

panel.add(chkDEM);

panel.add(lblYear).add(sldYear);

//panel.add(ui.Label('Month:')).add(select_month);

panel.add(lblCloud).add(sldCloud);

panel.add(ui.Label('Visualization:')).add(select_color);

panel.add(ui.Label('Enhancement:')).add(select_enhancer);

panel.add(ui.Label({ value: 'Download Image',
    style: {fontSize: '15px', fontWeight: 'bold', color: '#006600', textAlign: 'center' ,stretch: 'horizontal'}})).add(exporta);
    

// Create a function to render a Map layer configured by the user inputs.
function redraw() {
  
  leftMap.layers().reset();
  
  var im = select_image.getValue();
  var yr = sldYear.getValue();
  //var mt = select_month.getValue();
  var ct = sldCloud.getValue();
  var bc = select_color.getValue();
  var hc = select_enhancer.getValue();
  var dm = chkDEM.getValue();
  
  if (im == 'SELECT'){
    
    
    
  } else {
    
      var imI = images.indexOf(im) - 1;
      //var mtI = monthNames.indexOf(mt);
      var bcI = bandColors.indexOf(bc);
      var hcI = enhancer.indexOf(hc);
      
      //var start = yr + start_date[mtI-1];
      
      var start_date_year = '-01-01';
      var end_date_year = '-12-31';
      
      var start = yr + start_date_year;
      var end = yr + end_date_year;
      
      //taking care of leap years
      
      /*if(yr%4 === 0 && mtI === 2){
        end = yr + end_date[mtI-1];
      }else{
        
        if(mtI === 2){
        end = yr + '-02-28';
        }else{
          end = yr + end_date[mtI-1];
        }
        
      }*/
      
      
      var col = imagesCollection[imI];
      var cpr = cloudProperty[imI];
      var msk = cloudMasker[imI];
      var bcX = bandCombinations[imI];
      var bcl = bcX[bcI];
      var hcr = enhancer_code[hcI];
      
      //var lyr = loc + "_" + prefixImage[imI] + "_" + yr + "_" + mt + "_cloud_" + ct;
      var lyr = loc + "_" + prefixImage[imI] + "_" + yr + "_cloud_" + ct;
      
      print ("Processing " + lyr + " .......");
  
      processImage(lyr,bcl,start,end,ct,col,cpr,msk,hcr);
    
      print ("Finished.");
  }
  
  //add region
  
  leftMap.addLayer(ee.Image().paint(roi, 0, 2), null, loc);
  
  //add project locations
  var award_palette = ["a54438", "be8c6a", "888f8c", "251e17", "06adff", "68707b"];//, "e6f598", "abdda4", "66c2a5", "3288bd", "5e4fa2"
  
  var buffered = projects.map(function(ft){
    return ft.buffer(50).set({ncoords: ft.geometry().coordinates().length()})
  });
  
  leftMap.addLayer(ee.Image().int().paint(buffered, 'AWARDCODE',10), {min:1,max:6,palette: award_palette},"Projects", false)
  
  //add DEM
  
  if(dm){
        
          // Use the terrain algorithms to compute a hillshade with 8-bit values.
          var shade = ee.Terrain.hillshade(srtm_30);
        
          // Create a "sea" variable to be used for cartographic purposes
          var sea = srtm_30.lte(0);
          
          // Create a custom elevation palette from hex strings.
          var elevationPalette = ['006600', '002200', 'fff700', 'ab7634', 'c4d0ff', 'ffffff'];
          // Use these visualization parameters, customized by location.
          var visParams = {min: 0, max: 4550, palette: elevationPalette};
          
          // Create a mosaic of the sea and the elevation data
          var visualized = ee.ImageCollection([
            // Mask the elevation to get only land
            srtm_30.mask(sea.not()).visualize(visParams),
            // Use the sea mask directly to display sea.
            sea.mask(sea).visualize({palette:'000022'})
          ]).mosaic();
          
          // Convert the visualized elevation to HSV, first converting to [0, 1] data.
          var hsv = visualized.divide(255).rgbToHsv();
          // Select only the hue and saturation bands.
          var hs = hsv.select(0, 1);
          // Convert the hillshade to [0, 1] data, as expected by the HSV algorithm.
          var v = shade.divide(255);
          // Create a visualization image by converting back to RGB from HSV.
          // Note the cast to byte in order to export the image correctly.
          var rgb = hs.addBands(v).hsvToRgb().multiply(255).byte();
          leftMap.addLayer(rgb.clip(roi), {}, 'Elevation');
        
      }
  
}

// Invoke the redraw function once at start up to initialize the leftMap.
redraw();



// Add the panel to the ui.root.
//ui.root.insert(0, panel);

var splitPanel = ui.SplitPanel({
  firstPanel: rightMap,
  secondPanel: leftMap,
  wipe: true,
  style: {stretch: 'both'}
});

//ui.root.insert(1, splitPanel);

ui.root.widgets().reset([splitPanel]);
ui.root.insert(0, panel);
var linker = ui.Map.Linker([leftMap, rightMap]);