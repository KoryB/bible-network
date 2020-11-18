// Add a method to the graph model that returns an
// object with every neighbors of a node inside:
sigma.classes.graph.addMethod('neighbors', function(nodeId) {
  var k,
      neighbors = {},
      index = this.allNeighborsIndex[nodeId] || {};

  for (k in index)
    neighbors[k] = this.nodesIndex[k];

  return neighbors;
});


// Initialise sigma:
var s = new sigma(
  {
    renderer: {
      container: document.getElementById('graph-container'),
      type: 'canvas'
    },
    settings: {
     minEdgeSize: 0.1,
     maxEdgeSize: 2,
     minNodeSize: 1,
     maxNodeSize: 8,
    }
  }
);

sigma.parsers.gexf('LesMiserables.gexf', s, function() {
  s.graph.nodes().forEach(function(node, i, array) {
    node.size = .1;
    node.x = 10 * Math.cos(2 * i * Math.PI / 77);
    node.y = 10 * Math.sin(2 * i * Math.PI / 77);
  });

  // We first need to save the original colors of our
  // nodes and edges, like this:
  s.graph.nodes().forEach(function(n) {
    n.originalColor = n.color;
  });
  s.graph.edges().forEach(function(e) {
    e.originalColor = e.color;
  });

  // When a node is clicked, we check for each node
  // if it is a neighbor of the clicked one. If not,
  // we set its color as grey, and else, it takes its
  // original color.
  // We do the same for the edges, and we only keep
  // edges that have both extremities colored.
  s.bind('clickNode', function(e) {
    var nodeId = e.data.node.id,
        toKeep = s.graph.neighbors(nodeId);
    toKeep[nodeId] = e.data.node;

    if (s.isForceAtlas2Running()) {
      s.killForceAtlas2();
    }

    s.graph.nodes().forEach(function(n) {
      if (toKeep[n.id]) {
        n.color = n.originalColor;
        toKeep[n.id].x += 100;
      }
      else
        n.color = '#eee';
    });

    s.graph.edges().forEach(function(e) {
      if (toKeep[e.source] && toKeep[e.target])
        e.color = e.originalColor;
      else
        e.color = '#eee';
    });

    // Since the data has been modified, we need to
    // call the refresh method to make the colors
    // update effective.

    s.startForceAtlas2();
    s.refresh();
  });

  // When the stage is clicked, we just color each
  // node and edge with its original color.
  s.bind('clickStage', function(e) {
    s.graph.nodes().forEach(function(n) {
      n.color = n.originalColor;
    });

    s.graph.edges().forEach(function(e) {
      e.color = e.originalColor;
    });

    // Same as in the previous event:
    s.refresh();
  });

  s.startForceAtlas2({barnesHutOptimize: false});
  // setTimeout(function() {s.stopForceAtlas2()}, 6000);
  s.refresh();
});
