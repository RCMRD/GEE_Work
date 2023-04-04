/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var L8 = ee.ImageCollection("LANDSAT/LC08/C01/T1_SR"),
    conservancies = ee.FeatureCollection("users/firsake/conservancies_final");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

Map.centerObject(conservancies)
Map.addLayer(conservancies,{},"Conservancies")

var start_date = [
                   '2017-01-01',
                   '2017-02-01',
                   '2017-03-01',
                   '2017-04-01',
                   '2017-05-01',
                   '2017-06-01',
                   '2017-07-01',
                   '2017-08-01',
                   '2017-09-01',
                   '2017-10-01',
                   '2017-11-01',
                   '2017-12-01',
                   '2018-01-01',
                   '2018-02-01',
                   '2018-03-01',
                   '2018-04-01'
                 ];

var end_date = [
                   '2017-01-31',
                   '2017-02-28',
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
                   '2018-01-31',
                   '2018-02-28',
                   '2018-03-31',
                   '2018-04-30'
                 ];

var monthNames = [ 
                  "January_17", 
                  "February_17", 
                  "March_17", 
                  "April_17", 
                  "May_17", 
                  "June_17", 
                  "July_17", 
                  "August_17", 
                  "September_17", 
                  "October_17", 
                  "November_17",
                  "December_17",
                  "January_18", 
                  "February_18", 
                  "March_18"
                ];
                
                
function maskL8sr(image) {
  // Bits 3 and 5 are cloud shadow and cloud, respectively.
  var cloudShadowBitMask = ee.Number(2).pow(3).int();
  var cloudsBitMask = ee.Number(2).pow(5).int();

  // Get the pixel QA band.
  var qa = image.select('pixel_qa');

  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudShadowBitMask).eq(0)
      .and(qa.bitwiseAnd(cloudsBitMask).eq(0));

  // Return the masked image, scaled to [0, 1].
  return image.updateMask(mask).divide(10000);
}

for (var i = 0; i < monthNames.length; i++) { 
    

        var image = L8.filterDate(start_date[i], end_date[i])
            .filterBounds(conservancies)
            .map(maskL8sr)
            .median();
        
       
        var viRange = {min:0, max:1, palette: ['red','green','blue']};
        
        var ndvi = image.normalizedDifference(['B5','B4']).rename("ndvi")
        
        Map.addLayer(ndvi.clip(conservancies), viRange , "NDVI_"+monthNames[i])
        
        Export.image.toDrive({
          image:ndvi.clip(conservancies), 
          description:"NDVI_"+monthNames[i], 
          region:conservancies, 
          scale: 30, 
          maxPixels: 1e9
        })

}


