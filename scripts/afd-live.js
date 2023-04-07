
function getForm(){

    alphabet = document.getElementById('alfabeto-input').value.split(',');
    allStates = document.getElementById('estados-input').value.split(',');
    programFunction = document.getElementById('f-programa-input').value.trim().split(/[()]/);
    initialState = document.getElementById('estado-inicial-input').value;
    endState = document.getElementById('estados-finais-input').value.trim().split(',');

    //console.log({ alphabet,allStates,programFunction,initialState,endState })
    return {alphabet,allStates,programFunction,initialState,endState }
}

function getAFD(){
    const data = getForm();

    const nodes = [];
    const links = [];

    // Criar os nós
    data.allStates.forEach(state => {
    nodes.push({
        id: state,
        color: calcColor(data, state)
    });
    });

    // Criar os links
    data.programFunction.forEach(func => {
    if (func) {
        const [source, label, target] = func.split(",");
        links.push({
        source,
        target,
        label,
        });
    }
    });

    // Criar o objeto do grafo
    const graph = {
    nodes,
    links
    };


    return graph;
}

function calcColor(afd, id){
    
    if(afd.initialState == id){
        return 'green';
    }

    if(afd.endState.includes(id) ){
        return 'red';
    }
    
    return 'blue'
    
}

function refreshGraph(){
    
    graph = getAFD();

   // cross-link node objects
   graph.links.forEach(link => {
    const a = graph.nodes[link.source];
    const b = graph.nodes[link.target];
    if (!a || !b) {
        return; // skip this link if either a or b is undefined
    }
    !a.neighbors && (a.neighbors = []);
    !b.neighbors && (b.neighbors = []);
    a.neighbors.push(b);
    b.neighbors.push(a);

    !a.links && (a.links = []);
    !b.links && (b.links = []);
    a.links.push(link);
    b.links.push(link);
});

const highlightNodes = new Set();
const highlightLinks = new Set();
let hoverNode = null;


    const Graph = ForceGraph3D()
    (document.getElementById('3d-graph'))
        .height('500')
        .width('750')
        .graphData(graph)
        .linkLabel('label')
        .linkThreeObjectExtend(true)
        .nodeThreeObject(node => {
            const sprite = new SpriteText(node.id);
            sprite.material.depthWrite = false; // make sprite background transparent
            sprite.color = node.color;
            sprite.textHeight = 8;
            return sprite;
          })
        .linkThreeObject(link => {
          const sprite = new SpriteText(`${link.label}`);
          sprite.color = 'lightgrey';
          sprite.textHeight = 1.5;
          return sprite;
        })
        .linkPositionUpdate((sprite, { start, end }) => {
            const middlePos = Object.assign(...['x', 'y', 'z'].map(c => ({
              [c]: start[c] + (end[c] - start[c]) / 2 // calc middle point
            })));
  
            // Position sprite
            Object.assign(sprite.position, middlePos);
          })
        .linkDirectionalArrowLength(2)
        .linkDirectionalArrowRelPos(1)
        .linkCurvature(0.3);
        
}

document.addEventListener("DOMContentLoaded", function() {
    refreshGraph();
});
