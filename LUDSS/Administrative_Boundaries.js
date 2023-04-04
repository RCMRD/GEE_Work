/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var provinces = ee.FeatureCollection("projects/servir-e-sa/rwanda_ludss/RCMRD/RWA_adm1"),
    districts = ee.FeatureCollection("projects/servir-e-sa/rwanda_ludss/RCMRD/RWA_adm2"),
    sectors = ee.FeatureCollection("projects/servir-e-sa/rwanda_ludss/RCMRD/RWA_adm3"),
    cells = ee.FeatureCollection("projects/servir-e-sa/rwanda_ludss/RCMRD/RWA_adm4"),
    villages = ee.FeatureCollection("projects/servir-e-sa/rwanda_ludss/RCMRD/RWA_adm5");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

Map.centerObject(provinces);

var province_names;
var district_names;
var sector_names;
var cell_names;
var village_names;

provinces.sort('NAME_1').aggregate_array('NAME_1').evaluate(function(result) { province_names = result });
districts.sort('NAME_2').aggregate_array('NAME_2').evaluate(function(result) { district_names = result });
sectors.sort('NAME_3').aggregate_array('NAME_3').evaluate(function(result) { sector_names = result });
cells.sort('NAME_4').aggregate_array('NAME_4').evaluate(function(result) { cell_names = result });
villages.sort('NAME_5').aggregate_array('NAME_5').evaluate(function(result) { village_names = result });


var boundary_vis = {color: '000000FF', strokeWidth: 1};


//PANEL

var panel = ui.Panel();
panel.style().set('width', '300px');

// Create an intro panel with labels.
var intro = ui.Panel([
  ui.Label({
    value: 'Rwanda Administrative Boundaries',
    style: {fontSize: '20px', fontWeight: 'bold', color: '#000000',  textAlign: 'center'}
  }),
  ui.Label(
    {
    value: 'Display Region',
    style: {fontSize: '15px', fontWeight: 'bold', color: '#8f3334', textAlign: 'center',stretch: 'horizontal'}
    }
  )
]);

panel.add(intro);

//WIDGETS

var select_boundary = ui.Select({
      items: ['Province','District','Sector','Cell','Village'],
      placeholder: "Select Boundary",
      style: {textAlign:'center', stretch:'horizontal', margin:'10px'},
      onChange: getBoundaries
 });

var select_name = ui.Select({
      style: {textAlign:'center', stretch:'horizontal', margin:'10px'},
      onChange: zoomToLayer //function to parse the village layer
 });


//ADDING WIDGETS TO PANEL

panel.add(select_boundary);
panel.add(select_name);
ui.root.insert(0, panel);



function getBoundaries(){
  
  var selected_layer = select_boundary.getValue();
 
  switch(selected_layer) {
          
          case 'Province':
              select_name.items().reset(province_names)
              select_name.setPlaceholder('Select Province');
            break;
          
          case 'District':
              select_name.items().reset(district_names)
              select_name.setPlaceholder('Select District');
            break;
          
          case 'Sector':
              select_name.items().reset(sector_names)
              select_name.setPlaceholder('Select Sector');
            break;
          
          case 'Cell':
              select_name.items().reset(cell_names)
              select_name.setPlaceholder('Select Cell');
            break;
          
          case 'Village':
              select_name.items().reset(village_names)
              select_name.setPlaceholder('Select Village');
            break;
            
          default:
            break;
  }
  
}



function zoomToLayer(){
  
  Map.layers().reset();
  
  var selected_layer = select_boundary.getValue(); 
  var selected_region = select_name.getValue();
 
  switch(selected_layer) {
          
          case 'Province':
              var lyr_p = ee.Image().paint(provinces, 0, 2)
              Map.addLayer(lyr_p, null, 'Provinces');
              Map.centerObject(region(provinces,selected_region,'NAME_1').geometry());
              
            break;
          
          case 'District':
              var lyr_d = ee.Image().paint(districts, 0, 2)
              Map.addLayer(lyr_d, null, 'Districts');
              Map.centerObject(region(districts,selected_region,'NAME_2').geometry());
              
            break;
          
          case 'Sector':
              var lyr_s = ee.Image().paint(sectors, 0, 2)
              Map.addLayer(lyr_s, null, 'Sectors');
              Map.centerObject(region(sectors,selected_region,'NAME_3').geometry());
              
            break;
          
          case 'Cell':
              var lyr_c = ee.Image().paint(cells, 0, 2)
              Map.addLayer(lyr_c, null, 'Cells');
              Map.centerObject(region(cells,selected_region,'NAME_4').geometry());
              
            break;
          
          case 'Village':
              var lyr_v = ee.Image().paint(villages, 0, 2)
              Map.addLayer(lyr_v, null, 'Villages');
              Map.centerObject(region(villages,selected_region,'NAME_5').geometry());
              
            break;
            
          default:
            break;
  }
  
}


var region = function(boundary,name,property) {
  var result = boundary.filter(ee.Filter.eq(property, name)).first()
  return result;
}