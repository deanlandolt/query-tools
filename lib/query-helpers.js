var Query = require("./resource-query").Query,
    slice = require("./slice");

exports.accessedProperties = function(term, options) {
    // what to do about things like sort where we have to substr(1)?
}


var mergeQuerySlices = exports.mergeQuerySlices = function(term) {
    for (var i = 0; i < term.args.length; i++) {
        var prev = term.args[i-1],
            cur = term.args[i];
        if (typeof cur === "object") {
            if (typeof prev === "object" && prev.name == "slice" && cur.name == "slice") {
                try {
                    var newSlice = merge(prev.args, cur.args);
                    prev.args = newSlice;
                    term.args.splice(i,i);
                }
                catch (e) {
                }
            }
            else {
                mergeQuerySlices(cur);
            }
        }
    }
    return term;
}

exports.getCountAndRange = function(query, range) {
    // FIXME a proper copy would be cheaper and mergeQuerySlices should only happen once
    var count = mergeQuerySlices(Query("count(" + query + ")"));
    var rangeSlice = "&slice(" + range[0] + (range[1] && "," + range[1] || "") + ")";
    var results = mergeQuerySlices(Query(query + rangeSlice));
    return [count, results];
}