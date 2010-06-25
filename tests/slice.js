var slice = require("slice")//,
    //assert = require("assert");

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
        [[10,20], [2,-22], [0,0]]
    ],
    "+++ ": [
        [[5,10], [3], [8,10]],
        [[5,10], [6], [0,0]]
    ],
    "++--": [
        // TODO
        //lastDelta < firstDelta: firstEnd + lastStart, else [0,0]
        [[10,20], [-5,-3], [15,17]],
        [[10,20], [-25,-3], [10,17]],
        [[10,20], [-15,-13], [0,0]]
    ],
    "++- ": [
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
        [[5], [6], [11, Infinity]]
    ],
    "+ --": [
        [[5], [-9,-6], ""]
    ],
    "+ - ": [
        [[5], [-6], [5,-6]]
    ],
    "--++": [
        [[-20,-10], [3,5], [-17,-15]],
        [[-20,-10], [3,25], [-17,-10]],
        [[-20,-10], [13,25], [0,0]]
    ],
    "--+-": [
        [[-20,-10], [3,-5], [-17,-15]],
        [[-20,-10], [3,-15], [0,0]]
        [[-20,-10], [13,-5], [0,0]],
        [[-20,-10], [13,-15], [0,0]],
    ],
    "--+ ": [
        [[-11,-5], [2], [-9,-5]],
        [[-8,-5], [5], [0,0]]
    ],
    "----": [
    ],
    "--- ": [
        [[-20,-10], [-5], [-15,-10]],
        [[-20,-10], [-15], [-20,-10]],
        [[-20,-10], [-25], [-20,-10]]
    ],
    "- ++": [
        // TODO
        [[-20], [5,10], [-15,-5]],
        [[-20], [5,15], [-15,Infinity]]
    ],
    "- +-": [
        [[-20], [5,-5], [-15,-5]],
        [[-20], [5,-15], [0,0]],
        [[-20], [15,-5], [0,0]]
    ],
    "- + ": [
        [[-10], [6], [-4, Infinity]],
        [[-10], [16], [0,0]]
    ],
    "- --": [
        [[-25], [-20,-10], [-20,-10]],
        [[-15], [-20,-10], [-15,-10]]
        [[-5], [-20,-10], [0,0]]
    ],
    "- - ": [
        [[-10], [-20], [-10, Infinity]],
        [[-20], [-10], [-10, Infinity]],
        [[-10], [-10], [-10, Infinity]]
    ]
}

function show(first, next, should) {
    var was;
    try {
        was = slice.merge(first, next);
    }
    catch (e) {
        was = e;
    }
    print('merging', first, 'and', next, "should be", should, "was", was);
}

for (var i in tests) {
    for (var j = 0; j < tests[i].length; j++) {
        var args = tests[i][j];
        //assert.deepEqual(should, was);
        show.apply({}, args);
    }
}

//if (require.main == module)
//    require("os").exit(require("test/runner").run(exports));
