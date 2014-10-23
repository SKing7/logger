use motiming;
var rt = db.quartiles.find({}, {reportDate: 1}).sort({reportDate: -1});
var ds = {};
var d;
var tmp;
while (rt.hasNext()) {
    d = (rt.next().reportDate); 
    tmp = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    ds[tmp]= ds[tmp] || 0;
    ds[tmp]++;
}
print(tojson(ds));
