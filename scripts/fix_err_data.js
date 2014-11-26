use motiming;
var errorEnd = new Date('2014-10-22');
//db.quartiles.remove({"reportDate": {"$lt": errorEnd}, 'timingType': 'dl'}).remove();
var rt = db.quartiles.find({"reportDate": {"$lt": errorEnd}, 'timingType': 'dl'});
while (rt.hasNext()) {
    tmp = rt.next().reportDate; 
    print(tmp);
}

