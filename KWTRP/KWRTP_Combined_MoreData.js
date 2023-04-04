/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var Sentinel_2_image = ee.ImageCollection("COPERNICUS/S2"),
    che_map = ee.FeatureCollection("ft:1Fd7WIX_HsKQvbArAENyNdhwc4ZPaHBp29rwxt_Ai"),
    elg_map = ee.FeatureCollection("ft:1El3h8NTGPgWV2eRDELTCCqM_BI7pGiXRqBFQ63u_"),
    mau_map = ee.FeatureCollection("ft:1YLxPGkzUy1xVAH5vdGig8jgL_oX5H5sZ4yRprut5"),
    ken_map = ee.FeatureCollection("ft:1gG6pyEAMLXz9z_WnKMkb0ybJY1VkFBWGsG6lm8QX"),
    che_pe_crops = ee.FeatureCollection("ft:1arCAEGr5KA75th0o2yARN82sPwgJUM2yB7OpQSM7"),
    che_op_grassland = ee.FeatureCollection("ft:1pryJGJLkgRYTtKbV9GEsV7IYLHVC8c0YXlNWj8wa"),
    che_de_forest = ee.FeatureCollection("ft:1RETOSmOtM8Z5sbHZMdopm7ON_65D1OrBCaaQLKhK"),
    che_op_forest = ee.FeatureCollection("ft:1bWG3czh7jKqa0VuBzvKyE3G94dSy8O2xGsdnE2oo"),
    che_otherlands = ee.FeatureCollection("ft:1y1YRrEA0E9_1_vRLuCHXHFue8RuO5BJ-H27kyogV"),
    che_an_crops = ee.FeatureCollection("ft:1r8P_bDv2bMQvEpJYM1w9jcGwYs2antQsx5bYFk8z"),
    mau_pe_crops = ee.FeatureCollection("ft:1Hh8wffinf24xEAVqBlEdqk-s5pUHg4OkKSuYRsUk"),
    mau_op_grassland = ee.FeatureCollection("ft:19-a0N08LP9-678U6gYRBFe04ppMtf0iUsKBP1GHj"),
    mau_de_forest = ee.FeatureCollection("ft:1s7EilOKb-9i4qXQ-RYeAy8vEPae9CyPtnAaapom4"),
    mau_op_forest = ee.FeatureCollection("ft:1BlJFOpSu9JSyd-zlE_khpIpaexzeMSZO09RhI2la"),
    mau_otherlands = ee.FeatureCollection("ft:1jBcVaVYGu31sjzEWOI0_5f5scJGKF0Mo7ZWls3zh"),
    mau_an_crops = ee.FeatureCollection("ft:1zzKAYkz_19mkH71danUgZwVZoqwadiYRzFTTTB-7"),
    ken_pe_crops = ee.FeatureCollection("ft:1zCAp0vC2Z1o9yelzcAwaooH12mYTpbNWUfQSQEuz"),
    ken_op_grassland = ee.FeatureCollection("ft:1ForVeQnsMnuc-EF4jrrudi07z5ll_DciCSsTqNnZ"),
    ken_de_forest = ee.FeatureCollection("ft:1yL_bhyTXpVvzTZhHYHXMU6x64T4Atnh_seBJWpeU"),
    ken_op_forest = ee.FeatureCollection("ft:1JF1XuX_0wVbROXB0AYolRIyFA-jMcVJfytRfW1cH"),
    ken_otherlands = ee.FeatureCollection("ft:1isudbQ5-16UtK6G0Q_RnFgsbZYWzELtJX2gD0uio"),
    ken_an_crops = ee.FeatureCollection("ft:1YmiiYswYJ6-w9yGvcbnwH7t4nJUcredqD_mUIjUq"),
    elg_pe_crops = ee.FeatureCollection("ft:1o7EyvOdnbNVOnUtPO3JtBkKI0rO3C0HC981h2D-T"),
    elg_op_grassland = ee.FeatureCollection("ft:1VqLqJPQq05I7Gut1d54GWw9ZRBQfXc4jdSQy_2C5"),
    elg_de_forest = ee.FeatureCollection("ft:1Q2P0DG9BzrCpGAsaZvybUvQmjmJ4QKZGdpiVC3J0"),
    elg_op_forest = ee.FeatureCollection("ft:1fgmaVVn0meyRGGzLPy-f2qHBS2mmrqAhkj6zDSTd"),
    elg_otherlands = ee.FeatureCollection("ft:1IrsINyfsA5tzPUuZWdS0-bPV706lMEG1CWywEDQe"),
    elg_an_crops = ee.FeatureCollection("ft:15kmytDIJIi7Lq17fdiSV7aSomntibcH0Im2-Cgaw");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

var ROI_selected;
var CLF_selected;

var rgb_vis = {min:0, max:0.3, bands:['B4','B3','B2']};
var classified;
var classifier;
var training;
var validation;




var start_date = [
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
                   '-02-28',
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


var dflt = "SELECT";
var CHE = "CHERENGANI";
var ELG = "MT. ELGON";
var MAU = "MAU FOREST";
var KEN = "MT. KENYA";

var CHE_r = "CHERENGANI AREA";
var ELG_r = "MT. ELGON AREA";
var MAU_r = "MAU FOREST AREA";
var KEN_r = "MT. KENYA AREA";

var yearz = [dflt,'2016','2017'];

var CART = 'CART';
var SVM = 'SVM';
var RANDOM_FOREST = 'RANDOM_FOREST';
var MAXENT = 'MAXENT';




// Use these bands in the prediction.
var bands = ['B2', 'B3', 'B4', 'B5', 'B6', 'B7','B8','B8A'];

var newfc = mau_de_forest.merge(mau_an_crops).merge(mau_op_forest).merge(mau_op_grassland).merge(mau_otherlands).merge(mau_pe_crops)
.merge(che_de_forest).merge(che_an_crops).merge(che_op_forest).merge(che_op_grassland).merge(che_otherlands).merge(che_pe_crops)
.merge(elg_de_forest).merge(elg_an_crops).merge(elg_op_forest).merge(elg_op_grassland).merge(elg_otherlands).merge(elg_pe_crops)
.merge(ken_de_forest).merge(ken_an_crops).merge(ken_op_forest).merge(ken_op_grassland).merge(ken_otherlands).merge(ken_pe_crops);


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
  return image.updateMask(mask).divide(10000).copyProperties(image, ['system:time_start']);
}


/*
function maskL8(image) {
  var cloud = ee.Algorithms.Landsat.simpleCloudScore(image);
  var mask = cloud.select('cloud').lte(10); // play with this threshold
   return image.updateMask(mask);
}
*/




function getROI(roi_nm,start,end){
  
   
                      
    
    switch (roi_nm) {
    
          case MAU:
            
            Map.addLayer(mau_de_forest,{color: '00864A'}, 'Dense Forest',false);
            Map.addLayer(mau_an_crops,{color: '7e9752'}, 'Annual Crops',false);
            Map.addLayer(mau_op_forest,{color: '99CEB6'}, 'Open Forest',false);
            Map.addLayer(mau_op_grassland,{color: '7CFC00'}, 'Open Grassland',false);
            Map.addLayer(mau_otherlands,{color: 'EAB64F'}, 'Otherlands',false);
            Map.addLayer(mau_pe_crops,{color: '3f3f6d'}, 'Perennial Crops',false);
            
             Map.setCenter(35.577606,-0.176921, 10); 
            
            
            break;
            
          case CHE:
            
            Map.addLayer(che_de_forest,{color: '00864A'}, 'Dense Forest',false);
            Map.addLayer(che_an_crops,{color: '7e9752'}, 'Annual Crops',false);
            Map.addLayer(che_op_forest,{color: '99CEB6'}, 'Open Forest',false);
            Map.addLayer(che_op_grassland,{color: '7CFC00'}, 'Open Grassland',false);
            Map.addLayer(che_otherlands,{color: 'EAB64F'}, 'Otherlands',false);
            Map.addLayer(che_pe_crops,{color: '3f3f6d'}, 'Perennial Crops',false);
            
            Map.setCenter(35.500615,0.959570, 10); 
            
            
            break;
            
          case ELG:
            
            Map.addLayer(elg_de_forest,{color: '00864A'}, 'Dense Forest',false);
            Map.addLayer(elg_an_crops,{color: '7e9752'}, 'Annual Crops',false);
            Map.addLayer(elg_op_forest,{color: '99CEB6'}, 'Open Forest',false);
            Map.addLayer(elg_op_grassland,{color: '7CFC00'}, 'Open Grassland',false);
            Map.addLayer(elg_otherlands,{color: 'EAB64F'}, 'Otherlands',false);
            Map.addLayer(elg_pe_crops,{color: '3f3f6d'}, 'Perennial Crops',false);
            
            Map.setCenter(34.620716,1.018222, 10); 
            
            break;
            
          case KEN:
            
            Map.addLayer(ken_de_forest,{color: '00864A'}, 'Dense Forest',false);
            Map.addLayer(ken_an_crops,{color: '7e9752'}, 'Annual Crops',false);
            Map.addLayer(ken_op_forest,{color: '99CEB6'}, 'Open Forest',false);
            Map.addLayer(ken_op_grassland,{color: '7CFC00'}, 'Open Grassland',false);
            Map.addLayer(ken_otherlands,{color: 'EAB64F'}, 'Otherlands',false);
            Map.addLayer(ken_pe_crops,{color: '3f3f6d'}, 'Perennial Crops',false);
            
            Map.setCenter(37.317245,-0.165114, 9); 
            
            break;
            
          default:
            
            break;
            
    }
    
    
    var roi_set = ee.FeatureCollection(che_map.merge(elg_map).merge(ken_map).merge(mau_map));
    
    var composite = Sentinel_2_image.filterDate(start, end)
                      .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))//
                      .map(maskS2clouds)
                      .median()//
                      ;
                      
    /*var seasons = ee.List.sequence(3,14,3).map(function(month){
                      var start = ee.Number(month)
                      var end = start.add(2)
                      return collection.filter(ee.Filter.calendarRange(start, end, 'month'))
                      .median()
                  })
                  
                  print (seasons);*/

   /* var composite = ee.Image(seasons.get(0))
                    .addBands(seasons.get(1))
                    .addBands(seasons.get(2))
                    .addBands(seasons.get(3))*/
                      
    var roi_clip = composite.clipToCollection(roi_set); 
    
    
    var points = roi_clip.select(bands).sampleRegions({
        collection: newfc, 
        properties: ['CLASS'], 
        scale:30,
        tileScale: 1
      }).randomColumn();

    training = points.filter(ee.Filter.lt('random', 0.7));
    validation = points.filter(ee.Filter.gte('random', 0.7));
    
    return roi_clip;
    
}



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



function runclsf(roi_nm, clf, roi, dstart, dend, mystart, myend){
  
    var clsfname = "Classified_" + mystart + "_" + myend + "_" + clf;
    
    var caw = getROI(roi_nm,dstart,dend);
  
    // Classify the image.
    classified = caw.select(bands).classify(classifo(clf)).clip(roi);
    
    
    
    Map.addLayer(classified, {min: 0, max: 4, palette: ['00864A','7e9752','99CEB6','7CFC00','EAB64F','3F3F6D']}, clsfname);
    
    // Compute pixel area in square meters per landcover type.
    /*var stats = ee.Image.pixelArea().addBands(classified).reduceRegion({
      reducer: ee.Reducer.sum().group(1),
      geometry: roi,
      maxPixels: 1e9,
      scale: 20
    });*/
    
    
    //print('Area per class', stats);
    
    // Classify the validation data.
    var validated = validation.classify(classifo(clf));
    //print(validated);
    
    // Get a confusion matrix representing expected accuracy.
    var testAccuracy = validated.errorMatrix('CLASS', 'classification');
    //print('Validation error matrix: ', testAccuracy);
    print('Validation overall accuracy: ', testAccuracy.accuracy());

  
}



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


legend.add(makeRow('00864A','Dense Forest'));
legend.add(makeRow('7e9752','Annual Crops'));
legend.add(makeRow('99CEB6','Open Forest'));
legend.add(makeRow('7CFC00','Open Grassland'));
legend.add(makeRow('EAB64F','Otherlands'));
legend.add(makeRow('3F3F6D','Perennial Crops'));

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


///////////////////////////////////////////////////////////////////////////
var select_area = ui.Select({
  items: [dflt,CHE,ELG,MAU, KEN],
  value: dflt,
  style: {textAlign:'center', stretch:'horizontal', margin:'10px'},
  onChange: redraw,
});

var select_clf = ui.Select({
  items: [dflt,CART, SVM, RANDOM_FOREST, MAXENT],
  value: dflt,
  style: {textAlign:'center', stretch:'horizontal', margin:'10px'},
  onChange: redraw,
});

var select_Ystart = ui.Select({
  items: yearz,
  value: yearz[0],
  style: {textAlign:'center',stretch:'horizontal', margin:'10px'},
  onChange: redraw,
});

var select_start = ui.Select({
  items: monthNames,
  value: monthNames[0],
  style: {textAlign:'center',stretch:'horizontal', margin:'10px'},
  onChange: redraw,
});

var select_Yend = ui.Select({
  items: yearz,
  value: yearz[0],
  style: {textAlign:'center',stretch:'horizontal', margin:'10px'},
  onChange: redraw,
});

var select_end = ui.Select({
  items: monthNames,
  value: monthNames[0],
  style: {textAlign:'center',stretch:'horizontal', margin:'10px'},
  onChange: redraw,
});
//////////////////////////////////////////////////////////////////////////

var exporta = ui.Button({
      label: 'Export the current image to Drive',
      style: {textAlign:'center', stretch:'horizontal'},
      onClick: exportn
    });
    
panel.add(ui.Label('Region:')).add(select_area);

panel.add(ui.Label('Classifier:')).add(select_clf);

panel.add(ui.Label('Starting Year:')).add(select_Ystart);

panel.add(ui.Label('Starting period:')).add(select_start);

panel.add(ui.Label('Ending Year:')).add(select_Yend);

panel.add(ui.Label('Ending Period:')).add(select_end);

panel.add(ui.Label({ value: 'Export Raster',
    style: {fontSize: '15px', fontWeight: 'bold', color: '#006600', textAlign: 'center' ,stretch: 'horizontal'}})).add(exporta);

// Create a function to render a map layer configured by the user inputs.
function redraw() {
  Map.layers().reset();
  var area = select_area.getValue();
  var clsf = select_clf.getValue();
  
  var ystart = select_Ystart.getValue();
  var yend = select_Yend.getValue();
  
  var start = select_start.getValue();
  var end = select_end.getValue();
  
  var i_start = monthNames.indexOf(start);
  var i_end = monthNames.indexOf(end);
  
  var st_start = ystart + start_date[i_start];
  var st_end = yend + end_date[i_end];
  
  //leap year
  if ( (Number(yend)%4) === 0 && i_end === 1){
    st_end = yend + "_02_29";
  }
  
  var zstart = new Date(st_start);
  var zend = new Date(st_end);
  
  var mystart = start + "_" + ystart;
  var myend = end + "_" + yend;
  

  
  if (area != dflt && clsf != dflt && zstart < zend && ystart != dflt && yend != dflt) {
      
      switch (area) {
    
          case MAU:
              ROI_selected = mau_map;
              break;
              
          case CHE:
              ROI_selected = che_map;
              break;
              
          case ELG:
              ROI_selected = elg_map;
              break;
              
          case KEN:
              ROI_selected = ken_map;
              break;
              
      }
      
      print("***************************************************************")
      print("REGION: " +  area);
      print("PERIOD: " + mystart + " - " + myend);
      print("MODEL: " + clsf);
      print("")
     runclsf(area, clsf, ROI_selected, st_start, st_end, mystart, myend);
      
  }else{
    
    Map.setCenter(36.659149,0.065875, 8);
    Map.addLayer(mau_map,{}, MAU_r);
    Map.addLayer(che_map,{}, CHE_r);
    Map.addLayer(elg_map,{}, ELG_r);
    Map.addLayer(ken_map,{}, KEN_r);
    
  }
  
}


function exportn(){
        
        var area = select_area.getValue();
        var clsf = select_clf.getValue();
        var ystart = select_Ystart.getValue();
        var yend = select_Yend.getValue();
        
        var start = select_start.getValue();
        var end = select_end.getValue();
        
        var i_start = monthNames.indexOf(start);
        var i_end = monthNames.indexOf(end);
        
        var st_start = ystart + start_date[i_start];
        var st_end = yend + end_date[i_end];
        
        var zstart = new Date(st_start);
        var zend = new Date(st_end);
        
        var mystart = start + "_" + ystart;
        var myend = end + "_" + yend;
        
        var d = new Date();
        var n = d.getTime();
        var image_name = "KWTRP_" + area + "_" + clsf + "_"+ mystart + "_" + myend + "_" + n;
        
  
        if (area != dflt && clsf != dflt && zstart < zend) {
        
            Export.image.toDrive({
                                    image: classified, 
                                    description: image_name, 
                                    region: ROI_selected,
                                     maxPixels: 1e9,
                                    scale: 20, 
                                    crs: "EPSG:4326"
                                });
        }
        
}

// Invoke the redraw function once at start up to initialize the map.
redraw();

// Add the panel to the ui.root.
ui.root.insert(0, panel);