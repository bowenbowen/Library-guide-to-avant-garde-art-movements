var current = sessionStorage.getItem("current"); 
// To transfer variable value from one page to another. Cookie will be cleared after this page session. 
var dataset = [];

var windowW = document.documentElement.clientWidth;
var windowH = document.documentElement.clientHeight;
// To still be able to set height and width relative to viewport size instead of in px in javascript.

window.onhashchange  = function(){
    var hash = window.location.hash;
    
    if( hash == '#page1' ){
        $('#arrowUp').css('visibility','hidden');
        $('#arrowDown').css('visibility','visible');
    }else{
        $('#arrowUp').css('visibility','visible');
        $('#arrowDown').css('visibility','hidden');
    }
} // To hide one of the two arrows when it is not useful


window.onload = function(){ // Things happening after window loads up
    dataset.push(futurismList, constructivismList, dadaList, DestijlList, bauhausList, popartList);
    var currentData = dataset[current];
    // According to current movement index find corresponding info from dadaset
    
    
    // Save time by creating only one info page but changing title and contents to fit different art movementsw
    document.title = overviewData[current].name;                    // Change page title according to movement name
    $('#indiBGimg').attr('src', overviewData[current].picture);     // Change background image
    $('#indiIntro').html(overviewData[current].description);        // Change introduction content
    $('#movementTitle').html(overviewData[current].name);
    $('#deco').html(overviewData[current].name);
    
    
    
    
    //---------------- Initialize the fullpage library -------------------
    $('#fullpage').fullpage({
                scrollBar: false
            });

    books();
    
    
    //---------------- Drawing d3 force layout -------------------
    function books(){
        console.log(currentData);
        
        
        var   w = 0.7 * windowW,
              h =  windowH,
              coverH = 0.1 * windowW;


        var nodes = [
              { name: "Parent" }
        ];

        for(var i = 0; i < currentData.length-1; i++){
            nodes.push({name:'child'+i});
        }
        // Some tweaks here - unlike home pgae, the number of books can vary on this page. So the number of nodes should be dynamic as well. Altho can do the same thing on home page and it's smarter.
        
        var links = [];

        for (var i = 0; i< nodes.length; i++) {
              if (nodes[i].target !== undefined) {
                    for (var x = 0; x< nodes[i].target.length; x++ ) {
                          links.push({
                                source: nodes[i],
                                target: nodes[nodes[i].target[x]]
                          })
                    }
              }
        }

        var myChart = d3.select('#indiBooks')
                .append('svg')
                .attr('width', w)
                .attr('height', h)

        var force = d3.layout.force()
            .nodes(nodes)
            .gravity(0.15)
            .charge(-1000)
            .size([w, h])

        var node = myChart.selectAll('img')
            .data(nodes).enter()
            .append('g')
            .call(force.drag);


        node.append('image')
              .attr('x', function(d) { return d.x; })
              .attr('y', function(d) { return d.y; })
              .attr('height', coverH )
              .style('cursor','pointer')
               .attr('href', function(d, i){
                return currentData[i].cover;
                })
               .on('click', function(d,i){setInfo(i)})
               .on('mouseenter', function(d,i){ 
                    d3.select(this).style('opacity', 0.5);
                })
               .on('mouseout', function(d){ 
                    d3.select(this).style('opacity', 1);
                })


        force.on('tick', function(e) { // So that locations of elements update
            node.attr('transform', function(d, i) {
                return 'translate('+ d.x +', '+ d.y +')';
            })

        })


        force.start(); // Execute
        
}

       

    function setInfo(a){ // Display the info of a certain book. Interestingly it has to be in window.onload function here to work.
        $('h3').html(currentData[a].title);
        $('#author').html(currentData[a].author);
        $('#availability').html(currentData[a].availability);
        $('#bookInfo').css('visibility', 'visible');
    }
    
}

function closeInfo(){
        $('#bookInfo').css('visibility', 'hidden');
    }
 
