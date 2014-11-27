use motiming;
var rt = db.quartiles.find({})
var ds = {};
var tmp;
while (rt.hasNext()) {
    tmp = rt.next().name; 
    ds[tmp]= ds[tmp] || 0;
    ds[tmp]++;
}
print(tojson(ds));
