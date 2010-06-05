
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
        case "- + ":
            start = firstStart + nextStart;
            end = start + Math.min(firstEnd - start, nextEnd + firstStart - start);
            break;
        case "+++-":
        case "+-+-":
        case "+-+ ":
        case "+ +-":
        case "- +-":
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
            start = Math.max(firstStart, nextStart);
            end = Infinity;
            break;
        case "--- ":
            start = firstEnd + Math.max(firstStart - firstEnd, nextStart - firstEnd);
            end = firstEnd;
            break;
        case "- --":
            start = nextEnd + Math.max(firstStart - nextEnd , nextStart - nextEnd);
            end = nextEnd;
            break;
        case "+-++":
        case "+---":
        case "+-- ":
        case "+ --":
            throw new RangeError("Cannot combine slices [" + first + "] and [" + next + "]");
        case "--++":
        case "--+-":
        case "----":
        case "- ++":
        case "++--":
            throw new Error("NYI: " + signs);
        default:
            throw new RangeError;
    }
	
	return normalize([start, end]);
}
