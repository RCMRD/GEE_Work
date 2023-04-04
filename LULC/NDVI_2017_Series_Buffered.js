/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var L8 = ee.ImageCollection("LANDSAT/LC08/C01/T1_TOA"),
    table = ee.FeatureCollection("users/firsake/Kakamega_County");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
Map.setOptions('SATELLITE');

var wells = table;

Map.centerObject(wells);
Map.addLayer(wells);


function L8addNDVI(image) {
  var ndvi = image.normalizedDifference(['B5', 'B4']).rename('NDVI');
  return image.addBands(ndvi);
}

var collection8 = L8.filterDate('2017-01-01', '2017-12-31').map(L8addNDVI).select('NDVI').filterBounds(wells);


var table = collection8.map(function(img) {
  var dateStr = img.date();
  var dateNum = ee.Number.parse(dateStr.format("YYYYMMdd"));
  img = img.addBands(ee.Image(dateNum).rename('date'));
  return img.reduceRegions(wells, ee.Reducer.mean(), 30, "EPSG:4326")
}).flatten()


table = table.filter(ee.Filter.neq('NDVI', null)).select(['NDVI', 'date','label'])

Export.table(table, "NDVI_TS_2017_Data", {fileFormat: "CSV", driveFileNamePrefix: "NDVI_TS_2017_Data"});