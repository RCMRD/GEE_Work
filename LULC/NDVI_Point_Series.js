/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var L8 = ee.ImageCollection("LANDSAT/LC8_L1T_TOA"),
    L7 = ee.ImageCollection("LANDSAT/LE7_L1T_TOA"),
    L5 = ee.ImageCollection("LANDSAT/LT5_L1T_TOA");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
Map.setOptions('SATELLITE');

var wells = ee.FeatureCollection([
              ee.Feature(ee.Geometry.Point(38.67,1.06152).buffer(2500), {label:'Barcode - 5072'}),
              ee.Feature(ee.Geometry.Point(35.596426,3.111841).buffer(2500), {label:'Barcode - 5070'}),
              ee.Feature(ee.Geometry.Point(37.6322,0.4344).buffer(2500), {label:'Barcode - 5073'}),
              ee.Feature(ee.Geometry.Point(35.6415233,3.1068811).buffer(2500), {label:'Barcode - 5074'}),
              ee.Feature(ee.Geometry.Point(36.10206,1.181603).buffer(2500), {label:'Barcode - 5078'}),
              ee.Feature(ee.Geometry.Point(41.08295,11.81848).buffer(2500), {label:'Barcode - 5079'}),
              ee.Feature(ee.Geometry.Point(40.99119,11.73935).buffer(2500), {label:'Barcode - 5076'}),
              ee.Feature(ee.Geometry.Point(41.07579,11.81963).buffer(2500), {label:'Barcode - 5108'}),
              ee.Feature(ee.Geometry.Point(38.2381,3.2224).buffer(2500), {label:'Barcode - 6043'}),
              ee.Feature(ee.Geometry.Point(40.1139,0).buffer(2500), {label:'Barcode - 6009'}),
              ee.Feature(ee.Geometry.Point(38.1653,2.3532).buffer(2500), {label:'Barcode - 6036'}),
              ee.Feature(ee.Geometry.Point(38.1653,2.2085).buffer(2500), {label:'Barcode - 6039'}),
              ee.Feature(ee.Geometry.Point(37.6102,0.4341).buffer(2500), {label:'Barcode - 6042'}),
              ee.Feature(ee.Geometry.Point(37.5313,0.3981).buffer(2500), {label:'Barcode - 6044'}),
              ee.Feature(ee.Geometry.Point(39.3223,0.9047).buffer(2500), {label:'Barcode - 6046'}),
              ee.Feature(ee.Geometry.Point(35.5879,3.1145).buffer(2500), {label:'Barcode - 6048'}),
              ee.Feature(ee.Geometry.Point(39.603,0.6152).buffer(2500), {label:'Barcode - 6050'}),
              ee.Feature(ee.Geometry.Point(40.0633,0.3257).buffer(2500), {label:'Barcode - 6051'}),
              ee.Feature(ee.Geometry.Point(39.3729,1.5921).buffer(2500), {label:'Barcode - 6053'}),
              ee.Feature(ee.Geometry.Point(40.9995,11.6974).buffer(2500), {label:'Barcode - 6055'}),
              ee.Feature(ee.Geometry.Point(39.4741,1.0135).buffer(2500), {label:'Barcode - 6057'}),
              ee.Feature(ee.Geometry.Point(40.9995,11.6974).buffer(2500), {label:'Barcode - 6059'}),
              ee.Feature(ee.Geometry.Point(38.5307,0.5066).buffer(2500), {label:'Barcode - 6060'}),
              ee.Feature(ee.Geometry.Point(37.5028,0.3258).buffer(2500), {label:'Barcode - 6061'}),
              ee.Feature(ee.Geometry.Point(35.5879,3.1145).buffer(2500), {label:'Barcode - 6063'}),
              ee.Feature(ee.Geometry.Point(39.8056,0.2896).buffer(2500), {label:'Barcode - 6064'}),
              ee.Feature(ee.Geometry.Point(39.7319,0.4342).buffer(2500), {label:'Barcode - 6065'}),
              ee.Feature(ee.Geometry.Point(39.4235,-0.1448).buffer(2500), {label:'Barcode - 6066'}),
              ee.Feature(ee.Geometry.Point(35.5669,3.0406).buffer(2500), {label:'Barcode - 6067'}),
              ee.Feature(ee.Geometry.Point(40.0864,0.0724).buffer(2500), {label:'Barcode - 6068'}),
              ee.Feature(ee.Geometry.Point(38.0643,2.2804).buffer(2500), {label:'Barcode - 6069'}),
              ee.Feature(ee.Geometry.Point(37.5817,0.3619).buffer(2500), {label:'Barcode - 6070'}),
              ee.Feature(ee.Geometry.Point(37.9854,2.3172).buffer(2500), {label:'Barcode - 6073'}),
              ee.Feature(ee.Geometry.Point(35.2574,2.8961).buffer(2500), {label:'Barcode - 6074'}),
              ee.Feature(ee.Geometry.Point(38.9857,2.0635).buffer(2500), {label:'Barcode - 6075'}),
              ee.Feature(ee.Geometry.Point(39.0536,3.5499).buffer(2500), {label:'Barcode - 6081'}),
              ee.Feature(ee.Geometry.Point(40.0126,0.3256).buffer(2500), {label:'Barcode - 6085'}),
              ee.Feature(ee.Geometry.Point(40.2406,10.3332).buffer(2500), {label:'Barcode - 6086'}),
              ee.Feature(ee.Geometry.Point(40.8996,11.4022).buffer(2500), {label:'Barcode - 6088'}),
              ee.Feature(ee.Geometry.Point(39.1096,3.4388).buffer(2500), {label:'Barcode - 6089'}),
              ee.Feature(ee.Geometry.Point(42.0583,12.2928).buffer(2500), {label:'Barcode - 6090'}),
              ee.Feature(ee.Geometry.Point(37.2876,3.2951).buffer(2500), {label:'Barcode - 6091'}),
              ee.Feature(ee.Geometry.Point(39.0642,1.7735).buffer(2500), {label:'Barcode - 6094'}),
              ee.Feature(ee.Geometry.Point(35.6172,3.1134).buffer(2500), {label:'Barcode - 6097'}),
              ee.Feature(ee.Geometry.Point(39.2666,2.2444).buffer(2500), {label:'Barcode - 6098'}),
              ee.Feature(ee.Geometry.Point(39.7273,1.991).buffer(2500), {label:'Barcode - 6099'}),
              ee.Feature(ee.Geometry.Point(37.834,1.593).buffer(2500), {label:'Barcode - 6101'}),
              ee.Feature(ee.Geometry.Point(39.4741,1.0135).buffer(2500), {label:'Barcode - 6102'}),
              ee.Feature(ee.Geometry.Point(37.8844,1.9912).buffer(2500), {label:'Barcode - 6103'}),
              ee.Feature(ee.Geometry.Point(40.76165,11.12764).buffer(2500), {label:'Barcode - 5061'}),
              ee.Feature(ee.Geometry.Point(40.812238,11.4915).buffer(2500), {label:'Barcode - 5062'}),
              ee.Feature(ee.Geometry.Point(41,11.5).buffer(2500), {label:'Barcode - 5063'}),
              ee.Feature(ee.Geometry.Point(41.4559148,11.5451209).buffer(2500), {label:'Barcode - 5065'}),
              ee.Feature(ee.Geometry.Point(41.1,11.6).buffer(2500), {label:'Barcode - 5067'}),
              ee.Feature(ee.Geometry.Point(40.89034,11.41038).buffer(2500), {label:'Barcode - 5091'}),
              ee.Feature(ee.Geometry.Point(40.547045,11.458156).buffer(2500), {label:'Barcode - 5092'}),
              ee.Feature(ee.Geometry.Point(40.76067,11.4121483).buffer(2500), {label:'Barcode - 5094'}),
              ee.Feature(ee.Geometry.Point(40.72763,11.213078).buffer(2500), {label:'Barcode - 5096'}),
              ee.Feature(ee.Geometry.Point(40.7276,11.21071).buffer(2500), {label:'Barcode - 5097'}),
              ee.Feature(ee.Geometry.Point(40.770456,11.415698).buffer(2500), {label:'Barcode - 5098'}),
              ee.Feature(ee.Geometry.Point(41.0189,11.7649).buffer(2500), {label:'Barcode - 5099'}),
              ee.Feature(ee.Geometry.Point(40.91905,11.393666).buffer(2500), {label:'Barcode - 5107'}),
              ee.Feature(ee.Geometry.Point(40.871046,11.564175).buffer(2500), {label:'Barcode - 5154'}),
              ee.Feature(ee.Geometry.Point(39.7677,13.3305).buffer(2500), {label:'Barcode - 6045'}),
              ee.Feature(ee.Geometry.Point(39.6813,0.1085).buffer(2500), {label:'Barcode - 6056'}),
              ee.Feature(ee.Geometry.Point(40.2214,9.9633).buffer(2500), {label:'Barcode - 6080'}),
              ee.Feature(ee.Geometry.Point(40.0846,13.2898).buffer(2500), {label:'Barcode - 6052'}),
              ee.Feature(ee.Geometry.Point(40.0846,13.2546).buffer(2500), {label:'Barcode - 6037'}),
              ee.Feature(ee.Geometry.Point(39.8896,9.4549).buffer(2500), {label:'Barcode - 6087'}),
              ee.Feature(ee.Geometry.Point(39.8616,9.6372).buffer(2500), {label:'Barcode - 6093'}),
              ee.Feature(ee.Geometry.Point(39.9942,12.4425).buffer(2500), {label:'Barcode - 6096'}),
              ee.Feature(ee.Geometry.Point(39.9805,13.2878).buffer(2500), {label:'Barcode - 5071'}),
              ee.Feature(ee.Geometry.Point(40.303853,13.10803).buffer(2500), {label:'Barcode - 5106'}),
              ee.Feature(ee.Geometry.Point(41.2,11.7).buffer(2500), {label:'Barcode - 5104'}),
              ee.Feature(ee.Geometry.Point(40.123927,9.15613).buffer(2500), {label:'Barcode - 5064'}),
              ee.Feature(ee.Geometry.Point(39.947493,12.184504).buffer(2500), {label:'Barcode - 5066'}),
              ee.Feature(ee.Geometry.Point(40.2342,12.289).buffer(2500), {label:'Barcode - 6082'}),
              ee.Feature(ee.Geometry.Point(40.1508,9.4858).buffer(2500), {label:'Barcode - 6072'}),
              ee.Feature(ee.Geometry.Point(39.9942,12.4779).buffer(2500), {label:'Barcode - 6041'}),
              ee.Feature(ee.Geometry.Point(40.3562,9.4886).buffer(2500), {label:'Barcode - 6040'}),
              ee.Feature(ee.Geometry.Point(40.1911,11.8423).buffer(2500), {label:'Barcode - 6092'}),
              ee.Feature(ee.Geometry.Point(39.9279,11.919).buffer(2500), {label:'Barcode - 6047'}),
              ee.Feature(ee.Geometry.Point(40.3006,9.6391).buffer(2500), {label:'Barcode - 6083'}),
              ee.Feature(ee.Geometry.Point(40.404303,11.23455).buffer(2500), {label:'Barcode - 5060'}),
              ee.Feature(ee.Geometry.Point(40.3757,9.9298).buffer(2500), {label:'Barcode - 6049'}),
              ee.Feature(ee.Geometry.Point(40.1437,11.4059).buffer(2500), {label:'Barcode - 6095'}),
              ee.Feature(ee.Geometry.Point(40.3993,10.1484).buffer(2500), {label:'Barcode - 6054'}),
              ee.Feature(ee.Geometry.Point(40.5063,9.9272).buffer(2500), {label:'Barcode - 6038'}),
              ee.Feature(ee.Geometry.Point(36.0353,1.9548).buffer(2500), {label:'Barcode - 6029'}),
              ee.Feature(ee.Geometry.Point(35.6464,2.3894).buffer(2500), {label:'Barcode - 6013'}),
              ee.Feature(ee.Geometry.Point(35.6172,2.8965).buffer(2500), {label:'Barcode - 6008'}),
              ee.Feature(ee.Geometry.Point(35.6464,2.3894).buffer(2500), {label:'Barcode - 6002'}),
              ee.Feature(ee.Geometry.Point(34.5698,4.021).buffer(2500), {label:'Barcode - 6025'}),
              ee.Feature(ee.Geometry.Point(35.9479,3.0426).buffer(2500), {label:'Barcode - 6032'}),
              ee.Feature(ee.Geometry.Point(35.6382,3.0788).buffer(2500), {label:'Barcode - 6016'}),
              ee.Feature(ee.Geometry.Point(37.9128,2.0265).buffer(2500), {label:'Barcode - 6011'}),
              ee.Feature(ee.Geometry.Point(36.1201,3.4433).buffer(2500), {label:'Barcode - 6030'}),
              ee.Feature(ee.Geometry.Point(38.2158,2.3173).buffer(2500), {label:'Barcode - 6014'}),
              ee.Feature(ee.Geometry.Point(34.73554,0.34394).buffer(2500), {label:'Barcode - 4337'}),
              ee.Feature(ee.Geometry.Point(34.60923,0.18533).buffer(2500), {label:'Barcode - 4335'}),
              ee.Feature(ee.Geometry.Point(34.66188,0.3734).buffer(2500), {label:'Barcode - 4336'}),
              ee.Feature(ee.Geometry.Point(34.7122,0.36908).buffer(2500), {label:'Barcode - 4453'}),
              ee.Feature(ee.Geometry.Point(34.68248,0.26995).buffer(2500), {label:'Barcode - 4354'}),
              ee.Feature(ee.Geometry.Point(34.59453,0.13435).buffer(2500), {label:'Barcode - 4334'}),
              ee.Feature(ee.Geometry.Point(34.92353,0.56553).buffer(2500), {label:'Barcode - 4364'}),
              ee.Feature(ee.Geometry.Point(34.8059,0.3866).buffer(2500), {label:'Barcode - 4332'}),
              ee.Feature(ee.Geometry.Point(34.61149,0.18751).buffer(2500), {label:'Barcode - 4333'}),
              ee.Feature(ee.Geometry.Point(34.79453,0.35111).buffer(2500), {label:'Barcode - 4368'}),
              ee.Feature(ee.Geometry.Point(34.6724,0.3105).buffer(2500), {label:'Barcode - 4360'}),
              ee.Feature(ee.Geometry.Point(34.61042,0.39663).buffer(2500), {label:'Barcode - 4356'}),
              ee.Feature(ee.Geometry.Point(34.74814,0.43639).buffer(2500), {label:'Barcode - 4341'}),
              ee.Feature(ee.Geometry.Point(34.9204,0.4003).buffer(2500), {label:'Barcode - 4398'}),
              ee.Feature(ee.Geometry.Point(34.83679,0.48834).buffer(2500), {label:'Barcode - 4353'}),
              ee.Feature(ee.Geometry.Point(34.92207,0.4165).buffer(2500), {label:'Barcode - 4362'}),
              ee.Feature(ee.Geometry.Point(34.75177,0.45615).buffer(2500), {label:'Barcode - 4343'}),
              ee.Feature(ee.Geometry.Point(34.67867,0.27875).buffer(2500), {label:'Barcode - 4359'}),
              ee.Feature(ee.Geometry.Point(34.74064,0.44422).buffer(2500), {label:'Barcode - 4342'}),
              ee.Feature(ee.Geometry.Point(34.76857,0.44942).buffer(2500), {label:'Barcode - 4347'}),
              ee.Feature(ee.Geometry.Point(34.63502,0.44411).buffer(2500), {label:'Barcode - 4350'}),
              ee.Feature(ee.Geometry.Point(34.92277,0.42649).buffer(2500), {label:'Barcode - 4401'}),
              ee.Feature(ee.Geometry.Point(34.94324,0.42125).buffer(2500), {label:'Barcode - 4363'}),
              ee.Feature(ee.Geometry.Point(34.78319,0.48094).buffer(2500), {label:'Barcode - 4348'}),
              ee.Feature(ee.Geometry.Point(34.89973,0.43813).buffer(2500), {label:'Barcode - 4400'}),
              ee.Feature(ee.Geometry.Point(34.90871,0.43017).buffer(2500), {label:'Barcode - 4399'}),
              ee.Feature(ee.Geometry.Point(34.66846,0.38328).buffer(2500), {label:'Barcode - 4321'}),
              ee.Feature(ee.Geometry.Point(34.72064,0.4128).buffer(2500), {label:'Barcode - 4319'}),
              ee.Feature(ee.Geometry.Point(34.7227,0.41024).buffer(2500), {label:'Barcode - 4339'}),
              ee.Feature(ee.Geometry.Point(34.73731,0.43091).buffer(2500), {label:'Barcode - 4452'}),
              ee.Feature(ee.Geometry.Point(34.73754,0.43895).buffer(2500), {label:'Barcode - 4344'}),
              ee.Feature(ee.Geometry.Point(34.68609,0.37282).buffer(2500), {label:'Barcode - 4355'}),
              ee.Feature(ee.Geometry.Point(34.62812,0.36301).buffer(2500), {label:'Barcode - 4340'}),
              ee.Feature(ee.Geometry.Point(34.76213,0.46213).buffer(2500), {label:'Barcode - 4365'}),
              ee.Feature(ee.Geometry.Point(34.75906,0.46223).buffer(2500), {label:'Barcode - 4346'}),
              ee.Feature(ee.Geometry.Point(34.74421,0.42191).buffer(2500), {label:'Barcode - 4361'}),
              ee.Feature(ee.Geometry.Point(34.76986,0.47934).buffer(2500), {label:'Barcode - 4349'}),
              ee.Feature(ee.Geometry.Point(34.7623,0.43492).buffer(2500), {label:'Barcode - 4345'}),
              ee.Feature(ee.Geometry.Point(34.64181,0.43074).buffer(2500), {label:'Barcode - 4352'}),
              ee.Feature(ee.Geometry.Point(35.1035,0.37263).buffer(2500), {label:'Barcode - 4367'}),
              ee.Feature(ee.Geometry.Point(34.75398,0.44112).buffer(2500), {label:'Barcode - 4320'}),
              ee.Feature(ee.Geometry.Point(32.24021,2.13193).buffer(2500), {label:'Barcode - 282'}),
              ee.Feature(ee.Geometry.Point(31.99242,1.82901).buffer(2500), {label:'Barcode - 44'}),
              ee.Feature(ee.Geometry.Point(31.85467,1.88704).buffer(2500), {label:'Barcode - 54'}),
              ee.Feature(ee.Geometry.Point(31.77744,1.74801).buffer(2500), {label:'Barcode - 255'}),
              ee.Feature(ee.Geometry.Point(31.86804,1.7419).buffer(2500), {label:'Barcode - 126'}),
              ee.Feature(ee.Geometry.Point(31.76059,1.73554).buffer(2500), {label:'Barcode - 284'}),
              ee.Feature(ee.Geometry.Point(31.74972,1.84592).buffer(2500), {label:'Barcode - 134'}),
              ee.Feature(ee.Geometry.Point(31.84261,1.85629).buffer(2500), {label:'Barcode - 5'}),
              ee.Feature(ee.Geometry.Point(31.84257,1.85628).buffer(2500), {label:'Barcode - 5'}),
              ee.Feature(ee.Geometry.Point(31.87818,1.81207).buffer(2500), {label:'Barcode - 24'}),
              ee.Feature(ee.Geometry.Point(32.1892,2.01299).buffer(2500), {label:'Barcode - 206'}),
              ee.Feature(ee.Geometry.Point(31.86945,1.89448).buffer(2500), {label:'Barcode - 171'}),
              ee.Feature(ee.Geometry.Point(32.2868,2.15211).buffer(2500), {label:'Barcode - 319'}),
              ee.Feature(ee.Geometry.Point(31.74582,1.76135).buffer(2500), {label:'Barcode - 49'}),
              ee.Feature(ee.Geometry.Point(31.87303,1.81893).buffer(2500), {label:'Barcode - 1'}),
              ee.Feature(ee.Geometry.Point(32.1105,1.95243).buffer(2500), {label:'Barcode - 209'}),
              ee.Feature(ee.Geometry.Point(31.87652,1.76513).buffer(2500), {label:'Barcode - 133'}),
              ee.Feature(ee.Geometry.Point(31.5,1.9).buffer(2500), {label:'Barcode - 121'}),
              ee.Feature(ee.Geometry.Point(31.80015,1.66406).buffer(2500), {label:'Barcode - 341'}),
              ee.Feature(ee.Geometry.Point(31.71266,1.79457).buffer(2500), {label:'Barcode - 28'}),
              ee.Feature(ee.Geometry.Point(31.87104,1.76455).buffer(2500), {label:'Barcode - 228'}),
              ee.Feature(ee.Geometry.Point(32.09243,1.94665).buffer(2500), {label:'Barcode - 200'}),
              ee.Feature(ee.Geometry.Point(31.50622,1.67648).buffer(2500), {label:'Barcode - 326'}),
              ee.Feature(ee.Geometry.Point(31.72323,1.6927).buffer(2500), {label:'Barcode - 58'}),
              ee.Feature(ee.Geometry.Point(31.9875,1.83411).buffer(2500), {label:'Barcode - 94'}),
              ee.Feature(ee.Geometry.Point(32.1373,2.06369).buffer(2500), {label:'Barcode - 203'}),
              ee.Feature(ee.Geometry.Point(31.80816,1.90186).buffer(2500), {label:'Barcode - 161'}),
              ee.Feature(ee.Geometry.Point(31.90148,1.87327).buffer(2500), {label:'Barcode - 137'}),
              ee.Feature(ee.Geometry.Point(31.72421,1.7078).buffer(2500), {label:'Barcode - 9'}),
              ee.Feature(ee.Geometry.Point(31.96752,1.86642).buffer(2500), {label:'Barcode - 48'}),
              ee.Feature(ee.Geometry.Point(31.95771,1.89635).buffer(2500), {label:'Barcode - 185'}),
              ee.Feature(ee.Geometry.Point(31.880395,1.768521).buffer(2500), {label:'Barcode - 168'}),
              ee.Feature(ee.Geometry.Point(31.832299,1.775329).buffer(2500), {label:'Barcode - 183'}),
              ee.Feature(ee.Geometry.Point(32.117806,1.951564).buffer(2500), {label:'Barcode - 253'}),
              ee.Feature(ee.Geometry.Point(31.849647,1.790205).buffer(2500), {label:'Barcode - 270'}),
              ee.Feature(ee.Geometry.Point(31.886932,1.781282).buffer(2500), {label:'Barcode - 256'}),
              ee.Feature(ee.Geometry.Point(31.882881,1.783579).buffer(2500), {label:'Barcode - 69'}),
              ee.Feature(ee.Geometry.Point(31.87019,1.83199).buffer(2500), {label:'Barcode - 51'}),
              ee.Feature(ee.Geometry.Point(31.73238,1.74483).buffer(2500), {label:'Barcode - 18'}),
              ee.Feature(ee.Geometry.Point(32.14357,1.9733).buffer(2500), {label:'Barcode - 101'})
]);

Map.centerObject(wells);
Map.addLayer(wells);

//L8 - TOA (Apr 11, 2013 - Apr 30, 2017)
function L8addNDVI(image) {
  var ndvi = image.normalizedDifference(['B5', 'B4']).rename('NDVI');
  return image.addBands(ndvi);
}
var filtered = L8.filterDate('2013-04-11', '2017-04-30');
var with_ndvi = filtered.map(L8addNDVI).select('NDVI');

var pt = ee.Feature(ee.Geometry.Point(32.14357,1.9733).buffer(2500));
var extract_L8 = with_ndvi.getRegion(pt, 30);

// Do the getValue dance to evaluate the extracted region.
var serialized = ee.Serializer.toJSON(extract_L5);
print(ee.data.getValue({json: serialized}))



//print(Chart.image.series(with_ndvi.select('nd'), wells));




// Get a dictionary of means in the region.
/*var means = with_ndvi.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: wells,
  scale: 30
});

// Make a feature without geometry and set the properties to the dictionary of means.
var feature = ee.Feature(null, means);

// Wrap the Feature in a FeatureCollection for export.
var featureCollection = ee.FeatureCollection([feature]);

// Export the FeatureCollection.
Export.table.toDrive({
  collection: featureCollection,
  description: 'exportTableExample',
  fileFormat: 'CSV'
});*/

//L7 - TOA (Jan 1, 1999 - Apr 30, 2017) ~ Apr 10 2013 

//L5 - TOA (Jan 1, 1984 - May 5, 2012) ~ Dec 31 1998


              
