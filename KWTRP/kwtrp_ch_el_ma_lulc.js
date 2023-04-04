/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var che_de_forest = ee.FeatureCollection("ft:1WNv2jb--wLuSTj7lqkkVKJP2gcsE1CINmDsDxhI6"),
    che_an_crops = ee.FeatureCollection("ft:1HOEY64FwEkZuV08_sCOjulUJkE4cHoFXSdDfdFt5"),
    che_op_forest = ee.FeatureCollection("ft:18rjAAu7qpG5pbAibJA_KiFFqr7U-OrPlLeRMMIOj"),
    che_op_grassland = ee.FeatureCollection("ft:1XZEcxgm6i_YmpcF-AAhjUV1OSM7hl7rlzx88uwQa"),
    che_otherlands = ee.FeatureCollection("ft:1RMq4-9B1QolxMvN9rp5ipSVJDk1GdAm6RXXar53b"),
    che_pe_crops = ee.FeatureCollection("ft:1ebHnYHIvh39VwiaJ0OQ4KYewG5F7VLP6KvIVf4RX"),
    mau_de_forest = ee.FeatureCollection("ft:10nWXs_DurIDH5d29GfpRk5YUKC_ozQIhlAjDVvyP"),
    mau_an_crops = ee.FeatureCollection("ft:1pXCbO-091Fb4LsmWguuVab3zC3-b0t5_snlUTtVn"),
    mau_op_forest = ee.FeatureCollection("ft:1ykj6CVfN5tMlWQbvf-a6MFr6jWvI3BaT5OCu1GMM"),
    mau_op_grassland = ee.FeatureCollection("ft:1bu1I3WcTDUKV-NIIzxW_xuMaVW_PhmnVNuTgIlEB"),
    mau_otherlands = ee.FeatureCollection("ft:1q-H-r-oJAavPhrjfrYFy607e9XZRhb_hVeJTnFYS"),
    mau_pe_crops = ee.FeatureCollection("ft:1BSa4-ZeYj3-SMGAPwK-iwJ8sJAh1vdHgtCA7vFhS"),
    elg_de_forest = ee.FeatureCollection("ft:1JS29K6u9u_gCexE5e7vqMnSzqn__L6MQCAMf61dx"),
    elg_an_crops = ee.FeatureCollection("ft:1g9QJUhF5s0cwjdGMd14Q3C4BV-OtEu54Gshx1wq0"),
    elg_op_forest = ee.FeatureCollection("ft:1-zPG9lcf5HsZoxHDhFuFcpA0NPSNvwfXjM7B_Yv2"),
    elg_op_grassland = ee.FeatureCollection("ft:1L-KQPzNaKvgtY9jne6nJiIFNqZUt22VHD0Tqbgm4"),
    elg_otherlands = ee.FeatureCollection("ft:1w2KJKRu4W0XlOnbu2QsySfAP_ZrPd7X0c9wIgfkT"),
    elg_pe_crops = ee.FeatureCollection("ft:1VGHVTjGOpnjSpnIaTjPyHguH3NN0DQjugxK4ZyJu"),
    che_map = ee.FeatureCollection("ft:1Fd7WIX_HsKQvbArAENyNdhwc4ZPaHBp29rwxt_Ai"),
    elg_map = ee.FeatureCollection("ft:1El3h8NTGPgWV2eRDELTCCqM_BI7pGiXRqBFQ63u_"),
    mau_map = ee.FeatureCollection("ft:1YLxPGkzUy1xVAH5vdGig8jgL_oX5H5sZ4yRprut5"),
    Sentinel_2_image = ee.ImageCollection("COPERNICUS/S2");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

//outcommented the following - Area per class, FeatureCollection (print)

var ROI_selected;
var CLF_selected;
var newfc;
var rgb_vis = {min:0, max:0.3, bands:['B4','B3','B2']};
var classified;
var classifier;
var training;
var validation;
 
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
                   '2017-01-31',
                   '2017-02-29',
                   '2017-03-31',
                   '2017-04-30',
                   '2017-05-31',
                   '2017-06-30',
                   '2017-07-31',
                   '2017-08-31',
                   '2017-09-30',
                   '2017-10-31',
                   '2017-11-30',
                   '2017-12-31',
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

var CHE_r = "CHERENGANI AREA";
var ELG_r = "MT. ELGON AREA";
var MAU_r = "MAU FOREST AREA";


var CART = 'CART';
var SVM = 'SVM';
var RANDOM_FOREST = 'RANDOM_FOREST';
var MAXENT = 'MAXENT';




// Use these bands in the prediction.
var bands = ['B2', 'B3', 'B4', 'B5', 'B6', 'B7','B8','B8A'];


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


/*
function maskL8(image) {
  var cloud = ee.Algorithms.Landsat.simpleCloudScore(image);
  var mask = cloud.select('cloud').lte(10); // play with this threshold
   return image.updateMask(mask);
}
*/




function getROI(roi_var,roi_nm,start,end){
  
    var i_start = monthNames.indexOf(start);
    var i_end = monthNames.indexOf(end);
  
    var startdate = start_date[i_start];
    var enddate = end_date[i_end];
    
   

    var composite = Sentinel_2_image.filterDate(startdate, enddate)
                      .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
                      .map(maskS2clouds)
                      .median();
                      
    
    switch (roi_nm) {
    
          case MAU:
            
            Map.addLayer(mau_de_forest,{color: '00864A'}, 'Dense Forest',false);
            Map.addLayer(mau_an_crops,{color: '7e9752'}, 'Annual Crops',false);
            Map.addLayer(mau_op_forest,{color: '99CEB6'}, 'Open Forest',false);
            Map.addLayer(mau_op_grassland,{color: '7CFC00'}, 'Open Grassland',false);
            Map.addLayer(mau_otherlands,{color: 'EAB64F'}, 'Otherlands',false);
            Map.addLayer(mau_pe_crops,{color: '3f3f6d'}, 'Perennial Crops',false);
            
             Map.setCenter(35.577606,-0.176921, 10); 
            
            newfc = mau_de_forest.merge(mau_an_crops).merge(mau_op_forest).merge(mau_op_grassland).merge(mau_otherlands).merge(mau_pe_crops);
            
            break;
            
          case CHE:
            
            Map.addLayer(che_de_forest,{color: '00864A'}, 'Dense Forest',false);
            Map.addLayer(che_an_crops,{color: '7e9752'}, 'Annual Crops',false);
            Map.addLayer(che_op_forest,{color: '99CEB6'}, 'Open Forest',false);
            Map.addLayer(che_op_grassland,{color: '7CFC00'}, 'Open Grassland',false);
            Map.addLayer(che_otherlands,{color: 'EAB64F'}, 'Otherlands',false);
            Map.addLayer(che_pe_crops,{color: '3f3f6d'}, 'Perennial Crops',false);
            
            Map.setCenter(35.500615,0.959570, 10); 
            
            newfc = che_de_forest.merge(che_an_crops).merge(che_op_forest).merge(che_op_grassland).merge(che_otherlands).merge(che_pe_crops);
            
            break;
            
          case ELG:
            
            Map.addLayer(elg_de_forest,{color: '00864A'}, 'Dense Forest',false);
            Map.addLayer(elg_an_crops,{color: '7e9752'}, 'Annual Crops',false);
            Map.addLayer(elg_op_forest,{color: '99CEB6'}, 'Open Forest',false);
            Map.addLayer(elg_op_grassland,{color: '7CFC00'}, 'Open Grassland',false);
            Map.addLayer(elg_otherlands,{color: 'EAB64F'}, 'Otherlands',false);
            Map.addLayer(elg_pe_crops,{color: '3f3f6d'}, 'Perennial Crops',false);
            
            Map.setCenter(34.620716,1.018222, 10); 
            
            newfc = elg_de_forest.merge(elg_an_crops).merge(elg_op_forest).merge(elg_op_grassland).merge(elg_otherlands).merge(elg_pe_crops);
            break;
            
    }
    
    var roi_clip = composite.clip(roi_var);
    Map.addLayer(roi_clip, rgb_vis, roi_nm,false);
    
    var points = roi_clip.select(bands).sampleRegions({
        collection: newfc, 
        properties: ['CLASS'], 
        scale: 20
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



function runclsf(roi_nm, clf, roi, start, end){
  
    var clsfname = "Classified_" + start + "_" + end + "_" + clf;
    
  var caw = getROI(roi,roi_nm,start,end);
  
  
    // Classify the image.
    classified = caw.select(bands).classify(classifo(clf));
    
    
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
  items: [dflt,CHE,ELG,MAU],
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

var select_start = ui.Select({
  items: monthNames,
  value: monthNames[0],
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

panel.add(ui.Label('Starting period:')).add(select_start);

panel.add(ui.Label('Ending Period:')).add(select_end);

panel.add(ui.Label({ value: 'Export Raster',
    style: {fontSize: '15px', fontWeight: 'bold', color: '#006600', textAlign: 'center' ,stretch: 'horizontal'}})).add(exporta);

// Create a function to render a map layer configured by the user inputs.
function redraw() {
  Map.layers().reset();
  var area = select_area.getValue();
  var clsf = select_clf.getValue();
  var start = select_start.getValue();
  var end = select_end.getValue();
  
  var i_start = monthNames.indexOf(start);
  var i_end = monthNames.indexOf(end);
  
  if (area != dflt && clsf != dflt && i_start <= i_end) {
      
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
              
      }
      
      print("***************************************************************")
      print('REGION: ' +  area  + " * PERIOD: " + start + " - " + end + " * MODEL: " + clsf);
      print("")
      runclsf(area, clsf, ROI_selected, start, end);
      
  }else{
    
    Map.setCenter(36.659149,0.065875, 8);
    Map.addLayer(mau_map,{}, MAU_r);
    Map.addLayer(che_map,{}, CHE_r);
    Map.addLayer(elg_map,{}, ELG_r);
    
  }
  
}


function exportn(){
        
        var area = select_area.getValue();
        var clsf = select_clf.getValue();
        var start = select_start.getValue();
        var end = select_end.getValue();
        
        var d = new Date();
        var n = d.getTime();
        var image_name = "KWTRP_" + area + "_" + clsf + "_"+ start + "_" + end + "_" + n;
        
        
        var i_start = monthNames.indexOf(start);
        var i_end = monthNames.indexOf(end);
  
        if (area != dflt && clsf != dflt && i_start <= i_end) {
        
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