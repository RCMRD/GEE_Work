/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var roi = ee.FeatureCollection("ft:1HmilneMXPLxKLPXQO5IBu-cHCuaQq12niQFpvXvi"),
    L8 = ee.ImageCollection("LANDSAT/LC08/C01/T1_RT_TOA"),
    wells = ee.FeatureCollection("ft:1KjRVjmd0Neu3UIbP53koFZLdXlTAdTnV1uvFlcFi");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
//change cloud threshold allowance here !!!!!!
var default_cloud_thresh = 10;


Map.setOptions('SATELLITE');

Map.setCenter(50.79296875,6.751896464843375, 5);


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
                
var yearz = [dflt,'2016','2017'];


var cloudT;

var viRange = {min:0, max:1, palette: ['#FF0000','#FFFF00','#00FF00']};

var NDVIimage;

Map.addLayer(wells,{color: '000000'}, 'Wells');

function isInt(value) {
  return !isNaN(value) && 
         parseInt(Number(value)) == value && 
         !isNaN(parseInt(value, 10));
}


//change the value for this LTE
function maskL8(image) {
    var cloud = ee.Algorithms.Landsat.simpleCloudScore(image);
    var mask = cloud.select('cloud').lte(default_cloud_thresh);
    return image.updateMask(mask);
  }


function runndvier(start_date, end_date, cloudT, outname){
  
  
  
    var image = L8.filterDate(start_date, end_date)
                  .map(maskL8)
                  .median();
  
  
    var composite = image.clip(roi);
    
    //NDVI
    NDVIimage = composite.normalizedDifference(['B5', 'B4']);
    Map.addLayer(NDVIimage, viRange, outname);
  
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


legend.add(makeRow('00FF00','High'));
legend.add(makeRow('FFFF00','Medium'));
legend.add(makeRow('FF0000','Low'));

// Add the legend to the map.
Map.add(legend);

// Create a panel to hold our widgets.
var panel = ui.Panel();
panel.style().set('width', '300px');




// Create an intro panel with labels.
var intro = ui.Panel([
  ui.Label({
    value: 'KenyaRAPID Sweetlab / RCMRD Collaboration.',
    style: {fontSize: '20px', fontWeight: 'bold', color: '#003300',  textAlign: 'center'}
  }),
  ui.Label(
    {
    value: 'Wells Region NDVI Previewer',
    style: {fontSize: '15px', fontWeight: 'bold', color: '#006600', textAlign: 'center',stretch: 'horizontal'}
    }
  )
]);
panel.add(intro);

var legend2 = ui.Panel({widgets:[
  
  ui.Label({value: 'Legend (NDVI):', style: {fontWeight: 'bold'}}),
  
  ui.Panel({widgets:[
    ui.Label({
      style: {
        backgroundColor: '#00FF00',
        padding: '8px',
        margin: '0 0 4px 8px'
      }
    }),
    ui.Label({
      value: 'High',
      style: {margin: '0 0 4px 6px'}
    })], layout: ui.Panel.Layout.Flow('horizontal')}),
    
  ui.Panel({widgets:[
    ui.Label({
      style: {
        backgroundColor: '#FFFF00',
        padding: '8px',
        margin: '0 0 4px 8px'
      }
    }),
    ui.Label({
      value: 'Medium',
      style: {margin: '0 0 4px 6px'}
    })], layout: ui.Panel.Layout.Flow('horizontal')}),
    
    ui.Panel({widgets:[
    ui.Label({
      style: {
        backgroundColor: '#FF0000',
        padding: '8px',
        margin: '0 0 4px 8px'
      }
    }),
    ui.Label({
      value: 'Low',
      style: {margin: '0 0 4px 6px'}
    })], layout: ui.Panel.Layout.Flow('horizontal')})
    
    
  ], style:{margin: '0px 0px 10px 0px'}
});

panel.add(legend2);

///////////////////////////////////////////////////////////////////////////

var select_Ystart = ui.Select({
  items: yearz,
  value: yearz[0],
  style: {textAlign:'center',stretch:'horizontal', margin:'10px'},
  onChange: redraw
});

var select_start = ui.Select({
  items: monthNames,
  value: monthNames[0],
  style: {textAlign:'center',stretch:'horizontal', margin:'10px'},
  onChange: redraw
});

var select_Yend = ui.Select({
  items: yearz,
  value: yearz[0],
  style: {textAlign:'center',stretch:'horizontal', margin:'10px'},
  onChange: redraw
});

var select_end = ui.Select({
  items: monthNames,
  value: monthNames[0],
  style: {textAlign:'center',stretch:'horizontal', margin:'10px'},
  onChange: redraw
});


var cloud_thresh = ui.Textbox({
  value:default_cloud_thresh,
  style:{margin:'0px 28px', width:'50px'},
  onChange: redraw
});

cloud_thresh.setDisabled(true);

//////////////////////////////////////////////////////////////////////////

var exporta = ui.Button({
      label: 'Export the current image to Drive',
      style: {textAlign:'center', stretch:'horizontal'},
      onClick: exportn
    });
    
panel.add(ui.Label('Starting Year:')).add(select_Ystart);

panel.add(ui.Label('Starting period:')).add(select_start);

panel.add(ui.Label('Ending Year:')).add(select_Yend);

panel.add(ui.Label('Ending Period:')).add(select_end);

panel.add( 
  
  ui.Panel({widgets:[
    ui.Label('Cloud Threshold (%):'),
    cloud_thresh], layout: ui.Panel.Layout.Flow('horizontal')})
  
  
  );
           
                        
panel.add(ui.Label({ value: 'Export Raster',
    style: {fontSize: '15px', fontWeight: 'bold', color: '#006600', textAlign: 'center' ,stretch: 'horizontal'}})).add(exporta);

function redraw() {
  Map.layers().reset();
  
  
  cloudT  = cloud_thresh.getValue();
  
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
  
  var strStart = start + "_" + ystart;
  var strEnd = end + "_" + yend;
  
 
  
  if (zstart < zend && ystart != dflt && yend != dflt && isInt(cloudT)) {
      
      print("")
      print("***************************************************************")
      print("PERIOD: " + strStart + " - " + strEnd);
      
       var outname = "NDVI_" + strStart + "_" + strEnd + "_" + cloudT.toString();
      
     runndvier(st_start, st_end, cloudT, outname);
     
     print("***************************************************************")
    
      
  }else{
     /*print("")
     print("Please check on your variables and try again!")
     print("")
     print("***************************************************************")*/
  }
  
  Map.addLayer(wells,{color: '000000'}, 'Wells');
  
}




function exportn(){
        
        
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
        
        cloudT    = cloud_thresh.getValue();
        
        
        var mystart = start + "_" + ystart;
        var myend = end + "_" + yend;
        
        var d = new Date();
        var n = d.getTime();
        
        
  
        if (zstart < zend && ystart != dflt && yend != dflt && isInt(cloudT)) {
          
            var image_name = "NDVI_" + mystart + "_" + myend + "_" + cloudT.toString();
        
            Export.image.toDrive({
                                    image: NDVIimage, 
                                    description: image_name, 
                                    region: roi,
                                     maxPixels: 1e9,
                                    scale: 30, 
                                    crs: "EPSG:4326"
                                });
        }
        
}

// Invoke the redraw function once at start up to initialize the map.
redraw();

// Add the panel to the ui.root.
ui.root.insert(0, panel);
