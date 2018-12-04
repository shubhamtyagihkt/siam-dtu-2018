function mapfunc(){
    var mapProp = {
        center:new google.maps.LatLng(28.7501, 77.1177),
        zoom:15,
        mapTypeId:google.maps.MapTypeId.ROADMAP
        };
    var map=new google.maps.Map(document.getElementById("map-here"), mapProp);
}