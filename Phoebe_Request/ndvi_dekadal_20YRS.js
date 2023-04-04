/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var rois = ee.FeatureCollection("ft:1eYiCfcSkBEG6tfpAt6WMATNAu9wWfrC7aD9nfKst");
/***** End of imports. If edited, may not auto-convert in the playground. *****/



var L8 = ee.ImageCollection("LANDSAT/LC8_L1T")
    .filterDate('2016-01-01', '2017-01-01')
    .filterBounds(geometry)
    
var ndvi = landsat.map(function(image) {
  var result = image.normalizedDifference(["B5", "B4"]).rename("ndvi")
  return image.addBands(result);
})

var maxNDVI = ndvi.max().select("ndvi");

var region = geometry.buffer(10000)
Map.addLayer(region, {color: "yellow"}, "Region")

var stats = maxNDVI.addBands(zones).reduceRegion({
  reducer: ee.Reducer.mean().group(1),
  geometry: region,
  scale: 30
})

print(ui.Chart.image.seriesByRegion(ndvi, geometry, ee.Reducer.mean(),"ndvi", 30))