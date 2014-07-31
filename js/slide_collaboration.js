function KSlide_collaboration(net, people)
{
    var self = this;
    
    var arrayUnique = function(a) {
        return a.reduce(function(p, c) {
            if (p.indexOf(c) < 0) p.push(c);
            return p;
        }, []);
    };
    
    self.render = function(el, cb_done)
    {
            console.log("Render net", net);
        
            var g = {edges: [], nodes: []};
            var nodes = [];

            // Create edges, with weights
            for(var from in net)
            {
                var edges = net[from];

                for(var to in net)
                {
                    nodes.push(from);
                    nodes.push(to);
                    g.edges.push({id: i, source: from, target: to, size: net[from][to]});
                }
            }

            // Remove duplicate nodes
            var nodeList = arrayUnique(nodes);

            // Create a list of names from the people objects
            var names = [];
            for(var j in people)
            {
                var p = people[j];
                names[p.personid] = p.name;
            }
        
            // Add all the nodes, labelled with the person's name
            for(var i in nodeList)
            {
                g.nodes.push({id: nodeList[i], x: Math.random(), y: Math.random(), size: 2, label: names[id]});
            }


            var s = new sigma({
                graph: g,
                container: el,
                settings: {
                    drawEdges: true,
                    edgeColor: 'default',
                    defaultEdgeColor: '#ccc',
                    maxEdgeSize: 10,
                    minEdgeSize: 1
                }
            });

            s.startForceAtlas2();
            window.setTimeout(function(){s.stopForceAtlas2(); cb_done();}, 1500);
        }   
    }
}