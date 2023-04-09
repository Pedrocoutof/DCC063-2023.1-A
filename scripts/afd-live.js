
function getForm(){

    alphabet = document.getElementById('alfabeto-input').value.split(',');
    allStates = document.getElementById('estados-input').value.split(',');
    programFunction = document.getElementById('f-programa-input').value.trim().split(/[()]/);
    initialState = document.getElementById('estado-inicial-input').value;
    endState = document.getElementById('estados-finais-input').value.trim().split(',');

    //console.log({ alphabet,allStates,programFunction,initialState,endState })
    return {alphabet,allStates,programFunction,initialState,endState }
}

function getVariables(){
  particles = document.getElementById('particles').checked;
  focusNode = document.getElementById('focusNode').checked;
  textNode = document.getElementById('textNode').checked;
    return { particles, focusNode, textNode}
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
        return document.getElementById('initialState').value;
    }

    if(afd.endState.includes(id) ){
        return document.getElementById('endState').value;
    }
    
    return document.getElementById('state').value;
    
}

function refreshGraph(){
    
    variables = getVariables();
    graph = getAFD();

    let Graph = ForceGraph3D()
    (document.getElementById('3d-graph'))
      .width(document.getElementById('container').offsetWidth)
      .height(document.getElementById('container').offsetHeight)
      .graphData(graph)
      .linkLabel('label')
      .linkThreeObjectExtend(true)
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
      .linkCurvature(0.3)
      .cameraPosition({z: 90})


    if(variables.particles){
      Graph
            .linkDirectionalParticles("target")
            .linkDirectionalParticleSpeed(d => 0.01)
            .cameraPosition({ z: 90})
            
    }
    if(variables.focusNode){
      Graph.onNodeClick(node => {
        const distance = 40;
        const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);

        const newPos = node.x || node.y || node.z
          ? { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }
          : { x: 0, y: 0, z: distance }; // special case if node is in (0,0,0)

        Graph.cameraPosition(
          newPos, // new position
          node, // lookAt ({ x, y, z })
          3000  // ms transition duration
        );
      });  
    }
    if(variables.textNode){
      Graph
      .nodeThreeObject(node => {
          const sprite = new SpriteText(node.id);
          sprite.material.depthWrite = false; // make sprite background transparent
          sprite.color = node.color;
          sprite.textHeight = 8;
          return sprite;
        })
    }
}

document.addEventListener("DOMContentLoaded", function() {
    refreshGraph();
});
