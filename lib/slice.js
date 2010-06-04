
var NULL = exports.NULL = [0, 0];
var SIGNMAP = exports.SIGNMAP = {
    "++++": "++",
    "+++-": "++",
    "+++ ": "++",
    "++--": "++",
    "++- ": "++",
    "+-++": "",
    "+-+-": "+-",
    "+-+ ": "+-",
    "+---": "",
    "+-- ": "",
    "+ ++": "++",
    "+ +-": "+-",
    "+ + ": "+ ",
    "+ --": "",
    "+ - ": "+-",
    "--++": "--",
    "--+-": "--",
    "--+ ": "--",
    "----": "--",
    "--- ": "--",
    "- ++": "--",
    "- +-": "--",
    "- + ": "- ",
    "- --": "--",
    "- - ": "--"
}

var normalize = exports.normalize = function(slice) {
    if (slice[1] === 0) return NULL;
    if (typeof slice[1] === "undefined") {
        slice[1] = Infinity;
        return slice;
    }
    if (slice[1] === Infinity) return slice;
    if (slice[0] < 0 && slice[1] > 0) return NULL;
    if (slice[0] > 0 && slice[1] > 0 && slice[0] >= slice[1]) return NULL;
    if (slice[0] < 0 && slice[1] < 0 && slice[0] >= slice[1]) return NULL;
    return slice;
}

function getSign(n) {
    if (n === Infinity) return " ";
    return n >= 0 && "+" || "-";
}

var getSigns = exports.getSigns = function() {
    var signs = "";
    for (var i = 0; i < arguments.length; i++) {
        var slice = arguments[i];
        signs += getSign(slice[0]) + getSign(slice[1]);
    }
    return signs;
}

var merge = exports.merge = function(first, next) {
    first = normalize(first);
    next = normalize(next);
    
    // any slice ending in 0 == [0,0];
    if (first[1] === 0 || next[1] === 0) return NULL;
    
	var signs = getSigns(first, next),
        firstStart = first[0],
	    firstEnd = first[1],
	    nextStart = next[0],
	    nextEnd = next[1],
	    start, end;
    
    switch(signs) {
        case "++++":
        case "+++ ":
        case "+ ++":
        case "+ + ":
            start = firstStart + nextStart;
            end = Math.min(firstEnd - start, nextEnd + firstStart - start) + start;
            break;
        case "+++-":
        case "+-+-":
        case "+-+ ":
        case "+ +-":
        case "- +-":
        case "- + ":
        case "--+ ":
            start = firstStart + nextStart;
            end = (firstEnd === Infinity ? 0 : firstEnd) + (nextEnd === Infinity ? 0 : nextEnd);
            break;
        case "++- ":
            start = firstStart;
            end = firstEnd + nextStart;
            break;
        case "+ - ":
            start = firstStart;
            end = nextStart;
            break;
        case "- - ":
            //start = Math.max(firstStart, nextStart);
            start = firstStart + nextStart;
            end = Infinity;
            break;
        case "+-++":
        case "+---":
        case "+-- ":
        case "+ --":
            throw new RangeError("Cannot combine slices [" + first + "] and [" + next + "]");
        case "--++":
        case "--+-":
        case "----":
        case "--- ":
        case "- --":
        case "- ++":
        case "++--":
            throw new Error("NYI: " + signs);
        default:
            throw new RangeError;
    }
	
	return normalize([start, end]);
}





var tests = {
    "++++": [
        [[0,1], [0,1], [0,1]],
        [[0,1], [1,0], [0,0]],
        [[0,10], [0,1], [0,1]],
        [[0,1], [0,1], [0,1]],
        [[10,20], [5,10], [15,20]],
        [[5,10], [10,20], [0,0]],
        [[5,10], [4,20], [9,10]],
        [[5,10], [2,20], [7,10]],
        [[5,10], [2,4], [7,9]],
        [[0,10], [5,8], [5,8]],
        [[5,20], [6,30], [11,20]],
        [[5,20], [22,30], [0,0]]
    ],
    "+++-": [
        [[10,20], [2,-2], [12,18]]
    ],
    "+++ ": [
        [[5,10], [3], [8,10]],
        [[5,10], [6], [0,0]]
    ],
    "++--": [
        //lastDelta < firstDelta: firstEnd + lastStart, else [0,0]
    ],
    "++- ": [
        //start = firstStart
        //end = firstEnd + nextEnd
        [[5,15], [-9], [5,6]],
        [[5,15], [-10], [0,0]]
    ],
    "+-++": [
        [[5,-6], [9,13], ""]
    ],
    "+-+-": [
        [[2,-2], [2,-2], [4,-4]]
    ],
    "+-+ ": [
        [[2,-2], [2], [4,-2]]
    ],
    "+---": [
        [[10,-10], [-4,-2], ""]
    ],
    "+-- ": [
        [[10,-10], [-2], ""]
    ],
    "+ ++": [
        [[5], [6,9], [11,14]]
    ],
    "+ +-": [
        [[5], [6,-9], [11,-9]]
    ],
    "+ + ": [
        [[5], [6], [11]]
    ],
    "+ --": [
        [[5], [-9,-6], ""]
    ],
    "+ - ": [
        [[5], [-6], [5,-6]]
    ],
    "--++": [
    ],
    "--+-": [
    ],
    "--+ ": [
        [[-11,-5], [2], [-9,-5]],
        [[-8,-5], [5], [0,0]]
    ],
    "----": [
    ],
    "--- ": [
    ],
    "- ++": [
    ],
    "- +-": [
    ],
    "- + ": [
    ],
    "- --": [
    ],
    "- - ": [
    ]
}


function show(first, next, should) {
    var was;
    try {
        was = merge(first, next);
    }
    catch (e) {
        was = e;
    }
    print('merging', first, 'and', next, "should be", should, "was", was);
}

for (var i in tests) {
    for (var j = 0; j < tests[i].length; j++) {
        var args = tests[i][j];
        show.apply({}, args);
    }
}
