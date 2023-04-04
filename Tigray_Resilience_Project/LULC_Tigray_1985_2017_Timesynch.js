/* Developed by Servir-ESA for the LULC of Tigray region
   User can add polygons for more training sites for better results
   -Edward & Steve.
*/

Map.centerObject(roi,8);

var loc = "Tigray";
var finalImage;
var classified;
var classifier;

var CART = 'CART';
var SVM = 'SVM';
var RANDOM_FOREST = 'RANDOM_FOREST';
var MAXENT = 'MAXENT';

var classifiers = ['SELECT',CART,SVM,RANDOM_FOREST,MAXENT];


//images used with each epoch
//2018 - landsat 8
//2013 - landsat 8
//2008 - landsat 7
//2003 - landsat 7
//1998 - landsat 5

var years_ = ['2018','2013'/*,'2008','2003','1998'*/];
var year_image = [
                  [L8_imageCollection,['B4', 'B3', 'B2']],
                  [L8_imageCollection,['B4', 'B3', 'B2']],
                  /*[L7_imageCollection,['B3', 'B2', 'B1']],
                  [L7_imageCollection,['B3', 'B2', 'B1']],
                  [L5_imageCollection,['B3', 'B2', 'B1']]*/
                ];
                
var bands_class = ['B1','B2','B3','B4','B5','B6','B7','B10','B11'];
                
                

// Function to cloud mask from the pixel_qa band of Landsat 8 SR data.
function maskLSR(image) {
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


function classify_ftn(c_opt, training, bands){
  
      
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
            
            classifier = ee.Classifier.randomForest({
                numberOfTrees: 20,//was less
                seed: 1
              }).train({
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
                
                break;
                
        default:
        
                break;
            
        }
  
  return classifier;
  
}


function processImage(imCollection, start, end, lyr, cloud, cls,bands){
  
  
    //training sites from L8 in 2018 therefore sample as for L8 2018 and apply signature
    //to other L8 images
  
    var L8_reference_image_2018 = L8_imageCollection.filterDate(start, end)
                                  .filterBounds(roi)
                                  .filter(ee.Filter.lt("CLOUD_COVER_LAND", cloud))//cloud pixel percentage allowance over land
                                  .map(maskLSR);
    
    var L8_final_reference_2018_ROI = L8_reference_image_2018.median().clip(roi.geometry());
    
    
    var rangeBands = {
                nir: L8_final_reference_2018_ROI.select('B5'),
                red: L8_final_reference_2018_ROI.select('B4'),
                blue: L8_final_reference_2018_ROI.select('B2'),
                G_evi: ee.Number(2.5),
                C1_evi: ee.Number(6),
                C2_evi: ee.Number(7.5),
                L_evi: ee.Number(1),
                C1_savi: ee.Number(0.5),
                C2_savi: ee.Number(1.5),
                C1_msavi: ee.Number(2),
                C2_msavi: ee.Number(1),
                C3_msavi: ee.Number(8),
                swir1: L8_final_reference_2018_ROI.select('B6')
              };
              
      
      ///////////////////
      
      //NDVI
      var ndvi = L8_final_reference_2018_ROI.expression({
        expression: '(nir - red) / (nir + red)', 
        map: rangeBands
      });
      
      
      //EVI
      var evi = L8_final_reference_2018_ROI.expression({
        expression: 'G_evi * ((nir - red) / (nir +  C1_evi * red - C2_evi * blue + L_evi))', 
        map: rangeBands
      });
      
      
      //SAVI
      var savi = L8_final_reference_2018_ROI.expression({
        expression: '((nir - red )/ (nir + red + C1_savi))*C2_savi', 
        map: rangeBands
      });
      
      
      /*//MSAVI
      var msavi = L8_final_reference_2018_ROI.expression({
        expression: '(C1_msavi * nir + C2_msavi - ((C1_msavi * nir + C2_msavi)** C1_msavi).pow() - C3_msavi * (nir - red)) / C3_msavi',
        map: rangeBands
      });*/
      
      
      //NDMI
      var ndmi = L8_final_reference_2018_ROI.expression({
        expression: '(nir - swir1) / (nir + swir1)',
        map: rangeBands
      });
      
      
      L8_final_reference_2018_ROI = L8_final_reference_2018_ROI.addBands(ndvi.clip(roi).rename('ndvi'))
                                                               .addBands(evi.clip(roi).rename('evi'))
                                                               .addBands(savi.clip(roi).rename('savi'))
                                                               //.addBands(msavi.clip(roi).rename('ndvi'))
                                                               .addBands(ndmi.clip(roi).rename('ndmi'))
                                                               
      print(L8_final_reference_2018_ROI)
      
      //Map.addLayer(ndvi.clip(roi), viRange , "NDVI_"+mnth)
      
      
      
      ///////////////////
    
    
    
    var newfc_2018 = tigray_dense_forest_2018.merge(tigray_shrubland_2018).merge(tigray_cropland_2018)
                     .merge(tigray_urban_2018).merge(tigray_open_forest_2018).merge(tigray_waterbody_2018)
                     .merge(tigray_waterbody_dirty_2018).merge(tigray_crop_plantation_2018).merge(tigray_plantation_bare_2018)
                     .merge(tigray_open_grassland_2018).merge(tigray_bareland_2018).merge(tigray_unknown_northEast_2018);
    
    
    var points = L8_final_reference_2018_ROI.sampleRegions({
        collection: newfc_2018, 
        properties: ['CLASS'], 
        scale: 30
      }).randomColumn({seed: 10});

    var training = points.filter(ee.Filter.lt('random', 0.7));
    var validation = points.filter(ee.Filter.gte('random', 0.7));
    
    ///////////////////////////////////////////////////////////////////////////////////////
    
    var collection = imCollection.filterDate(start, end)
                                  .filterBounds(roi)
                                  .filter(ee.Filter.lt("CLOUD_COVER_LAND", cloud))//cloud pixel percentage allowance over land
                                  .map(maskLSR);
        
    var composite = collection.median();
    //var finalImage = composite.clip(roi.geometry());
    
    //classified = finalImage.classify(classify_ftn(cls,training,bands_class));
    //Map.addLayer(finalImage, {bands: bands, min: 0, max: 0.3}, lyr+'_Image');
    
    
    
    
    
    classified = L8_final_reference_2018_ROI.classify(classify_ftn(cls,training,bands_class));
    Map.addLayer(L8_final_reference_2018_ROI, {bands: bands, min: 0, max: 0.3}, lyr+'_Image');
    
    
    Map.addLayer(classified, {min: 0, max: 11, palette: ['006600','B2B200','FFFF00','FF9900','b4dbc0','0000FF','0000FF','FFFF00','FFFF00','E5CC99','804D33','804D33']}, lyr+'_Classified');
    
    // Compute pixel area in square meters per landcover type.
    var stats = ee.Image.pixelArea().addBands(classified).reduceRegion({
      reducer: ee.Reducer.sum().group(1),
      geometry: roi,
      maxPixels: 1e13,
      bestEffort: true,
      tileScale:10,
      scale: 30
    });
    
    
    print('Area per class', stats);
    
    // Classify the validation data.
    var validated = validation.classify(classify_ftn(cls,training,bands_class));
    //print(validated);
    
    // Get a confusion matrix representing expected accuracy.
    var testAccuracy = validated.errorMatrix('CLASS', 'classification');
    print('Validation error matrix: ', testAccuracy);
    print('Validation overall accuracy: ', testAccuracy.accuracy());
    
    var trainAccuracy = classifier.confusionMatrix().accuracy();
    print('trainAccuracy', trainAccuracy); 
    
    var consumerAcc = testAccuracy.consumersAccuracy();
    print('Consumers Accuracy',consumerAcc);
    
    var producerAcc = testAccuracy.producersAccuracy();
    print('Producers Accuracy',producerAcc);
    
    /*//////////////////////////////////////////////////////////
    //////    6. Compute area for each land class     ////////
    //////////////////////////////////////////////////////////
    
    var split = classified.eq([0,1,2,4,5,6,7,8,9,10,11]); 
    var area = split.multiply(ee.Image.pixelArea()).divide(1000000);
    var villWithClassAreaHa = area.reduceRegions({
      collection:wc12,
      reducer:ee.Reducer.sum(),
      scale:30,
    });
    print(villWithClassAreaHa);*/
    
    
}
           

/////////////////////////////////////////////////////////////////////////////////////////////

                                
// Create a panel to hold our widgets.
var panel = ui.Panel();
panel.style().set('width', '300px');

// Create an intro panel with labels.
var intro = ui.Panel([
  ui.Label({
    value: 'LULC Classifier',
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

var select_classifier = ui.Select({
  items: classifiers,
  value: classifiers[0],
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
  min: 2013,
  max: 2018,
  value: 2018,
  step: 5,
  style: {textAlign:'center',stretch:'horizontal', margin:'10px'},
  onChange: redraw
});


var exporta = ui.Button({
      label: 'Export the current image to Drive',
      style: {textAlign:'center', stretch:'horizontal'},
      
      onClick: function() {
        var d = new Date();
        var n = d.getTime();
        
        var image_name = loc + "_YR_" + sldYear.getValue() + "_CLS_" + select_classifier.getValue() + "_" + n;
        
        if (select_classifier.getValue() == 'SELECT'){
          
          print ("Please select classifier first");
          
        }else{
            
              Export.image.toDrive({
                                    image: classified.int16(), 
                                    description: image_name, 
                                    maxPixels: 1e13,
                                    region:roi.geometry().bounds(),
                                    scale: 30, 
                                    crs: "EPSG:4326"
                                });
                                
        }
        
      }
});

panel.add(ui.Label('Select Classifier:')).add(select_classifier);

panel.add(chkDEM);

panel.add(lblYear).add(sldYear);

panel.add(ui.Label({ value: 'Download Image',
    style: {fontSize: '15px', fontWeight: 'bold', color: '#006600', textAlign: 'center' ,stretch: 'horizontal'}})).add(exporta);
    

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


legend.add(makeRow('006600','Dense Forest'));
legend.add(makeRow('B2B200','Shrub land'));
legend.add(makeRow('FFFF00','Cropland'));
legend.add(makeRow('FF9900','Urban'));
legend.add(makeRow('b4dbc0','Open Forest'));
legend.add(makeRow('0000FF','Open Water'));
legend.add(makeRow('E5CC99','Open Grassland'));
legend.add(makeRow('804D33','Bareland'));


// Add the legend to the map.
Map.add(legend);



// Create a function to render a map layer configured by the user inputs.
function redraw() {
  
  Map.layers().reset();
  
  var cls = select_classifier.getValue();
  var yr = sldYear.getValue();
  var cloud = 50;
  var dm = chkDEM.getValue();
  
  if (cls == 'SELECT'){
    
    
    
  } else {
    
      var index  = years_.indexOf(yr.toString());
      
      var imCollection = year_image[index][0];
      
      var bands = year_image[index][1];
      
    
      var start_date_year = '-01-01';
      var end_date_year = '-12-31';
      
      var start = yr.toString() + start_date_year;
      var end = yr.toString() + end_date_year;
      
      var lyr = loc + "_" + yr.toString() + "_" + cls;
      
      print ("Processing " + lyr + " .......");
  
      processImage(imCollection, start, end, lyr, cloud, cls,bands);
    
      print ("Finished.");
  }
  
  //add region
  
  Map.addLayer(ee.Image().paint(roi, 0, 2), null, loc);
  
  //add project locations
  var award_palette = ["000000", "000000", "000000", "000000", "000000", "000000"];
  //var award_palette = ["a54438", "be8c6a", "888f8c", "251e17", "06adff", "68707b"];//, "e6f598", "abdda4", "66c2a5", "3288bd", "5e4fa2"
  var buffered = projects.map(function(ft){
    return ft.buffer(50).set({ncoords: ft.geometry().coordinates().length()})
  });
  
  Map.addLayer(ee.Image().int().paint(buffered, 'AWARDCODE',10), {min:1,max:6,palette: award_palette},"Projects", false)
  
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
          Map.addLayer(rgb.clip(roi), {}, 'Elevation');
        
      }
  
}

// Invoke the redraw function once at start up to initialize the map.
redraw();

// Add the panel to the ui.root.
ui.root.insert(0, panel);