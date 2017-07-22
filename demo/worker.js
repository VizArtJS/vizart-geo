importScripts("https://d3js.org/d3.v4.min.js");
importScripts("./lib/d3-ForceEdgeBundling.js");

onmessage = function(event) {
    var nodes = event.data.nodes,
        links = event.data.links;

    var fbundling = d3.ForceEdgeBundling().nodes(nodes).edges(links);
    var results = fbundling();

    postMessage({type: "end", nodes: nodes, links: results});
};