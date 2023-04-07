
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
