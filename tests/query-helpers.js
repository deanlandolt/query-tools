var Query = require("resource-query").Query;
print(slice.mergeQuerySlices(Query("slice(2,9)&slice(3,5)")));
print(slice.mergeQuerySlices(Query("foo=bar&baz(slice(2,9),slice(3,5))")));

var result = slice.getCountAndRange(Query("foo=bar&slice(5,50)"), [10,20]);
print("count:", result[0], "range query:", result[1]);
