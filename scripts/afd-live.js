
function getAFD(){
    
    alphabet = document.getElementById('alfabeto-input').value.split(',');
    allStates = document.getElementById('estados-input').value.split(',');
    programFunction = document.getElementById('f-programa-input').value.split(/[()]/);
    initialState = document.getElementById('estado-inicial-input').value;
    endState = document.getElementById('estados-finais-input').value.split(',');

    console.log({ alphabet,allStates,programFunction,initialState,endState })
    return {alphabet,allStates,programFunction,initialState,endState }
}

function refreshGraph(){
    const data = getAFD();

    
    const nodes = [];
    const links = [];

    // Criar os nós
    data.allStates.forEach(state => {
    nodes.push({
        id: state,
        name: `State ${state}`,
        color: "#ff7f0e"
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

    const Graph = ForceGraph3D()
    (document.getElementById('3d-graph'))
        .height('500')
        .width('750')
        .graphData(graph)
        .nodeLabel('id')
        .linkDirectionalParticles("value")
        .linkDirectionalParticleSpeed(d => 0.1);
        
}

document.addEventListener("DOMContentLoaded", function() {
    refreshGraph();
});
