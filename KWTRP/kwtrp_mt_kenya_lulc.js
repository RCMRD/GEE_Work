/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var shr = ee.FeatureCollection("ft:1BSYOCzMC4Q5xKaJ53brG43kbdfKpXb_LEckN5sI2"),
    opf = ee.FeatureCollection("ft:18TKtZdm_u216L_8aD2VLCMAiXplleqqABzPa9sd8"),
    grs = ee.FeatureCollection("ft:1g2ZCC7WFuxScgJcFTe8e-uTPp6wXdcxDWBgDl1-z"),
    clf = ee.FeatureCollection("ft:1dnIUFCpjs0ceJykvdAO35oPGlIGllJK865zhMFq5"),
    agr = ee.FeatureCollection("ft:1owYk-Na3GTnLGv1hdCqZNQJ5F3lBrK_OM2MRRio8"),
    agm = ee.FeatureCollection("ft:1kAAftYsSRRBe193Ji4xGf_wEYtvSCvIJViYajmTk"),
    Sentinel_2_image = ee.ImageCollection("COPERNICUS/S2"),
    ROI = ee.FeatureCollection("ft:1gG6pyEAMLXz9z_WnKMkb0ybJY1VkFBWGsG6lm8QX"),
    yngb = ee.FeatureCollection("ft:1R1nqbSJPB8-2qrsyySZuZxyw-ZeECiHKIqw6VdsW"),
    svtb = ee.FeatureCollection("ft:1jnsIpWmZwGHUpkoBhJMfkCtb7VviKH8TcBogHP8C"),
    agbb = ee.FeatureCollection("ft:1AV5VdqTy9XHeYX7XExENkvyrc8ngT_hjDZNm-6Ht"),
    savb = ee.FeatureCollection("ft:1NTAD3sU2s2_bNI7nINtYtG4730Va3T5w_VkHnc25"),
    dgfb = ee.FeatureCollection("ft:1gDpNujkQkdi6CToRe1IjQ9C4X23cVJx1bGVzDfEO"),
    dfcb = ee.FeatureCollection("ft:16DLM6OSaR9ZXCuOxoALno1LZu4XCaBfuqzuXwuwd");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
 
Map.setCenter(37.317245,-0.165114, 9);
 
var classified;
 
var start_date = [
                   '2016-01-01',
                   '2016-02-01',
                   '2016-03-01',
                   '2016-04-01',
                   '2016-05-01',
                   '2016-06-01',
                   '2016-07-01',
                   '2016-08-01',
                   '2016-09-01',
                   '2016-10-01',
                   '2016-11-01',
                   '2016-12-01',
                 ];

var end_date = [
                   '2016-01-31',
                   '2016-02-29',
                   '2016-03-31',
                   '2016-04-30',
                   '2016-05-31',
                   '2016-06-30',
                   '2016-07-31',
                   '2016-08-31',
                   '2016-09-30',
                   '2016-10-31',
                   '2016-11-30',
                   '2016-12-31',
                 ];

var monthNames = [ 
                  "January", 
                  "February", 
                  "March", 
                  "April", 
                  "May", 
                  "June", 
                  "July", 
                  "August", 
                  "September", 
                  "October", 
                  "November",
                  "December"
                ];


var CART = 'CART';
var SVM = 'SVM';
var RANDOM_FOREST = 'RANDOM_FOREST';
var MAXENT = 'MAXENT';


var jan = 'JANUARY';
var feb = 'FEBRUARY';
var mar = 'MARCH';
var apr = 'APRIL';
var may = 'MAY';
var jun = 'JUNE';
var jul = 'JULY';
var aug = 'AUGUST';
var sep = 'SEPTEMBER';
var oct = 'OCTOBER';
var nov = 'NOVEMBER';
var dec = 'DECEMBER';


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

// Map the function over one year of data and take the median.
var composite = Sentinel_2_image.filterDate('2016-01-01', '2016-03-31')
                  // Pre-filter to get less cloudy granules.
                  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 5))
                  .map(maskS2clouds)
                  .median();

var c2 = composite.clip(ROI);

//Map.addLayer(dfc,{color: '900600'}, 'Deforested/Cut');
//Map.addLayer(agb,{color: 'c99c83'}, 'Agriculture Bare');
//Map.addLayer(svt,{color: 'd8dba0'}, 'Savanna trees');
//Map.addLayer(dgf,{color: 'ec5300'}, 'Degraded Forest');


var newfc = shr.merge(opf).merge(grs).merge(clf).merge(agr).merge(agm);

// Use these bands in the prediction.
var bands = ['B2', 'B3', 'B4', 'B5', 'B6', 'B7','B8','B8A'];

// Make training data by 'overlaying' the points on the image.
var points = c2.select(bands).sampleRegions({
  collection: newfc, 
  properties: ['CLASS'], 
  scale: 15
}).randomColumn();

var training = points.filter(ee.Filter.lt('random', 0.7));
var validation = points.filter(ee.Filter.gte('random', 0.7));




function classifo(c_opt){
  var classifier;
  switch (c_opt) {
    case CART:
        
            // Get a CART classifier and train it.
            classifier = ee.Classifier.cart().train({
              features: training, 
              classProperty: 'CLASS', 
              inputProperties: bands
            });
                
        break;
        
    case SVM:
        
        var svm_opt = {
                    kernelType: 'RBF',
                    gamma: 0.5,
                    cost: 10
                  };
        
            // Get a SVM classifier and train it.
            classifier = ee.Classifier.svm(svm_opt).train({
              features: training, 
              classProperty: 'CLASS', 
              inputProperties: bands
            });
            
        break;
        
    case RANDOM_FOREST:
        
        classifier = ee.Classifier.randomForest(10).train({
              features: training, 
              classProperty: 'CLASS', 
              inputProperties: bands
            });
        
        break;
        
    case "MAXENT":
        
        classifier = ee.Classifier.gmoMaxEnt().train({
              features: training, 
              classProperty: 'CLASS', 
              inputProperties: bands
            });
        
}
  
  return classifier;
}

function runclsf(x){
// Classify the image.
classified = c2.select(bands).classify(classifo(x));
var clsfname = "Classified_" + x;
// Display the classification results.
Map.addLayer(c2, {bands: ['B4', 'B3', 'B2'], min: 0, max: 0.3}, 'Kenya Water Towers');
Map.addLayer(shr,{color: 'c3aa69'}, 'Shrubs');
Map.addLayer(opf,{color: 'b76031'}, 'Open Forest');
Map.addLayer(grs,{color: '91af40'}, 'Grassland');
Map.addLayer(clf,{color: '225129'}, 'Closed Forest');
Map.addLayer(agr,{color: 'cdb33b'}, 'Agriculture');
Map.addLayer(agm,{color: '33280d'}, 'Agriculture Mosaic');
Map.addLayer(classified, {min: 0, max: 4, palette: ['c3aa69','d9903d','b76031','91af40','225129','cdb33b','33280d']}, clsfname);

// Compute pixel area in square meters per landcover type.
var stats = ee.Image.pixelArea().addBands(classified).reduceRegion({
  reducer: ee.Reducer.sum().group(1),
  geometry: ROI,
  maxPixels: 1e9,
  scale: 15
});
print('Area per class', stats);

// Classify the validation data.
var validated = validation.classify(classifo(x));
print(validated);

// Get a confusion matrix representing expected accuracy.
var testAccuracy = validated.errorMatrix('CLASS', 'classification');
print('Validation error matrix: ', testAccuracy);
print('Validation overall accuracy: ', testAccuracy.accuracy());
}



//runclsf('MAXENT');


// Add legend
// Create the panel for the legend items.
var legend = ui.Panel({
  style: {
    position: 'bottom-right',
    padding: '8px 15px'
  }
});


// Creates and styles 1 row of the legend.
var makeRow = function(color, name) {
  // Create the label that is actually the colored box.
  var colorBox = ui.Label({
    style: {
      backgroundColor: '#' + color,
      // Use padding to give the box height and width.
      padding: '8px',
      margin: '0 0 4px 0'
    }
  });

  // Create the label filled with the description text.
  var description = ui.Label({
    value: name,
    style: {margin: '0 0 4px 6px'}
  });

  return ui.Panel({
    widgets: [colorBox, description],
    layout: ui.Panel.Layout.Flow('horizontal')
  });
};

legend.add(makeRow('c3aa69','Shrubs'));
legend.add(makeRow('d9903d','Savanna'));
legend.add(makeRow('b76031','Open Forest'));
legend.add(makeRow('91af40','Grassland'));
legend.add(makeRow('225129','Closed Forest'));
legend.add(makeRow('cdb33b','Agriculture'));
legend.add(makeRow('33280d','Agriculture Mosaic'));

// Add the legend to the map.
Map.add(legend);

// Create a panel to hold our widgets.
var panel = ui.Panel();
panel.style().set('width', '300px');

// Create an intro panel with labels.
var intro = ui.Panel([
  ui.Label({
    value: 'Kenya Water Towers Reference Project',
    style: {fontSize: '20px', fontWeight: 'bold', color: '#003300',  textAlign: 'center'}
  }),
  ui.Label(
    {
    value: 'Land Use/Land Cover Classification',
    style: {fontSize: '15px', fontWeight: 'bold', color: '#006600', textAlign: 'center',stretch: 'horizontal'}
    }
  )
]);
panel.add(intro);


var select = ui.Select({
  items: [CART, SVM, RANDOM_FOREST, MAXENT],
  value: CART,
  style: {textAlign:'center', stretch:'horizontal', margin:'10px'},
  onChange: redraw,
});

var select2 = ui.Select({
  items: [jan, feb, mar, apr, may, jun, jul, aug, sep,oct, nov, dec],
  value: jan,
  style: {textAlign:'center',stretch:'horizontal', margin:'10px'},
  onChange: redraw,
});

var exporta = ui.Button({
      label: 'Export the current image to Drive',
      style: {textAlign:'center', stretch:'horizontal'},
      
      onClick: function() {
        var d = new Date();
        var n = d.getTime();
        var image_name = "KWTRP_classified_" + select2.getValue() + "_" + select.getValue() + "_" + n;
        
        
        Export.image.toDrive({
                                image: classified, 
                                description: image_name, 
                                region: ROI,
                                 maxPixels: 1e9,
                                scale: 15, 
                                crs: "EPSG:4326"
                            });
        
        
      }
    });

panel.add(ui.Label('Classifier:')).add(select);

panel.add(ui.Label('Month:')).add(select2);

panel.add(ui.Label({ value: 'Export Raster',
    style: {fontSize: '15px', fontWeight: 'bold', color: '#006600', textAlign: 'center' ,stretch: 'horizontal'}})).add(exporta);

// Create a function to render a map layer configured by the user inputs.
function redraw() {
  Map.layers().reset();
  var layer = select.getValue();
  runclsf(layer);
}

// Invoke the redraw function once at start up to initialize the map.
redraw();

// Add the panel to the ui.root.
ui.root.insert(0, panel);






