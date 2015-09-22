use motiming;
var errorKey = 'rt_rt_nearby_index';
db.quartiles.update({
    name: errorKey
}, {
    $set: { name: 'rt_nearby_index'}
}, {
    multi: true
});

