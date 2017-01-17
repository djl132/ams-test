/**
 * Created by DerekJLin on 10/27/16.
 */

//PATHFINDING
function findPath(a, b) {
    //keep track of the possible paths
    var work = [[a]];

    //iterate through each possible node.
    for (var i = 0; i < work.length; i++) {

        //
        var cur = work[i];
        var end = cur[cur.length - 1];

        //if the ending path node
        if (end == b)
            return cur;

        //look through each edge of the end nodes of each path from a to b, and find if there are any
        end.edges.forEach(function(next) {

            //what exactly is this checking for
            //look for a path that does not ends in the edge of end.
            if (!work.some(function(path) {
                    return work[work.length - 1] == next;
                }))

            //push that path into working list
                work.push(cur.concat([next]));
        });
    }
}

var graph = treeGraph(4, 4);
var root = graph[0], leaf = graph[graph.length - 1];
console.log(findPath(root, leaf).length);
// → 4

leaf.connect(root);
console.log(findPath(root, leaf).length);
// → 2



///////OPTIMIZIN
function withIDs(graph) {
    for (var i = 0; i < graph.length; i++) graph[i].id = i;
    return graph;
}
var graph = withIDs(treeGraph(8, 5));

function findPath_ids(a, b) {
    var work = [[a]];
    var seen = Object.create(null);
    for (var i = 0; i < work.length; i++) {
        var cur = work[i], end = cur[cur.length - 1];
        if (end == b) return cur;
        end.edges.forEach(function(next) {
            if (!seen[next.id]) {
                seen[next.id] = true;
                work.push(cur.concat([next]));
            }
        });
    }
}

var startTime = Date.now();
console.log(findPath_ids(graph[0], graph[graph.length - 1]).length);
console.log("Time taken with ids:", Date.now() - startTime);

function listToArray(list) {
    var result = [];
    for (var cur = list; cur; cur = cur.via)
        result.unshift(cur.last);
    return result;
}

function findPath_list(a, b) {
    var work = [{last: a, via: null}];
    var seen = Object.create(null);
    for (var i = 0; i < work.length; i++) {
        var cur = work[i];
        if (cur.last == b) return listToArray(cur);
        cur.last.edges.forEach(function(next) {
            if (!seen[next.id]) {
                seen[next.id] = true;
                work.push({last: next, via: cur});
            }
        });
    }
}

var startTime = Date.now();
console.log(findPath_list(graph[0], graph[graph.length - 1]).length);
console.log("Time taken with ids + lists:", Date.now() - startTime);