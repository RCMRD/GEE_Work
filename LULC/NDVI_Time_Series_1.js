/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var wells = ee.FeatureCollection("ft:1Rfq7kGiBqgxno082NtyzfrghEfChQ3HcoTRKdT04"),
    L8NDVI = ee.ImageCollection("LANDSAT/LC8_L1T_8DAY_NDVI"),
    L7NDVI = ee.ImageCollection("LANDSAT/LE7_L1T_8DAY_NDVI"),
    L5NDVI = ee.ImageCollection("LANDSAT/LT5_L1T_8DAY_NDVI"),
    L4NDVI = ee.ImageCollection("LANDSAT/LT4_L1T_8DAY_NDVI");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
Map.setOptions('SATELLITE');
Map.centerObject(wells);
Map.addLayer(wells);

//L8 - 8-Day NDVI (Apr 07, 2013 - May 01, 2017) -> May 01, 2017
//L7 - 8-Day NDVI (Jan 01, 1999 - May 01, 2017) -> Apr 06, 2013
//L5 - 8-Day NDVI (Jan 01, 1984 - May 08, 2012) -> Dec 31, 1998
//L4 - 8-Day NDVI (Aug 21, 1982 - Dec 19, 1993) -> Dec 31, 1983

var collection4 = L4NDVI.filterDate('1982-08-21', '1983-12-31');
var collection5 = L5NDVI.filterDate('1984-01-01', '1998-12-31');
var collection7 = L7NDVI.filterDate('1999-01-01', '2013-04-06');
var collection8 = L4NDVI.filterDate('2013-04-07', '2017-05-01');

var col = ee.ImageCollection(collection4.merge(collection5).merge(collection7).merge(collection8));

var table = col.map(function(img) {
  var dateStr = img.date();
  var dateNum = ee.Number.parse(dateStr.format("YYYYMMdd"));
  img = img.addBands(ee.Image(dateNum).rename('date'));
  return img.reduceRegions(wells, ee.Reducer.mean(), 30, "EPSG:4326")
}).flatten()

table = table.filter(ee.Filter.neq('NDVI', null)).select(['NDVI', 'date'])

print(table.first());
Export.table(table, "NDVI_TS", {fileFormat: "CSV", driveFileNamePrefix: "NDVI_TS"});