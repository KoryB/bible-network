/**
 * Here is just a basic example on how to properly display a graph
 * exported from Gephi in the GEXF format.
 *
 * The plugin sigma.parsers.gexf can load and parse the GEXF graph file,
 * and instantiate sigma when the graph is received.
 *
 * The object given as the second parameter is the base of the instance
 * configuration object. The plugin will just add the "graph" key to it
 * before the instanciation.
 *
 * https://github.com/jacomyal/sigma.js/blob/master/examples/load-external-gexf.html
 */
sigma.parsers.gexf('example.gexf', {
  container: 'graph-container'
});
