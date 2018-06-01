var current = 0;
var timelineArray = [];


var windowW = document.documentElement.clientWidth;
var windowH = document.documentElement.clientHeight;
// To still be able to set height and width relative to viewport size instead of in px in javascript.


window.onhashchange  = function(){
    var hash = window.location.hash;
    console.log(hash);
    
    if( hash == '#page1' ){
        $('#arrowUp').css('visibility','hidden');
        $('#arrowDown').css('visibility','visible');
    }else{
        $('#arrowUp').css('visibility','visible');
        $('#arrowDown').css('visibility','hidden');
    }
} // To hide one of the two arrows when it is not useful


window.onload = function(){ // Things happening after window loads up
    
    
    //---------------- Generating a dataset in a format usable by d3 timeline ------------------- 
    for (var i = 0; i < overviewData.length; i++){
        startTime = new Date((overviewData[i].start), 1, 1).getTime();
        endTime = new Date((overviewData[i].end), 1, 1).getTime();
        
        var colour;
        if(i % 3 == 1){ colour = "#FFFF00"; }
        else if(i % 3 == 2){ colour = "#C1272D"; }
        else{ colour = "#29ABE2"; }
        
        var eachMov = {times: [{"color":colour, "starting_time": startTime, "ending_time": endTime}]}
        timelineArray.push(eachMov); 
        
    }
    
    
    //---------------- Drawing the timeline -------------------
    var width = 0.7 * windowW, height = 0.05 * windowH, margin = 20; 
    
    function timeline() {
        var chart = d3.timeline()
          .width(width)
          .itemHeight(height)
          .itemMargin(margin) 
          .stack()
//          .margin({left:70, right:30, top:0, bottom:0})
          .tickFormat({
              format: d3.time.format("%Y"), //https://github.com/d3/d3-3.x-api-reference/blob/master/Time-Formatting.md
              tickTime: d3.time.years,
              tickInterval: 10,
              tickSize: 6
            })
          .hover(function (d, i, datum) {
              // d is the current rendering object
              // i is the index during d3 rendering
              // datum is the id object

           })
          .hover(function (d, i, datum) {
            current = i; // Record the info of which movement is to be seen
            $("#movTitle").html( overviewData[i].name );
            $("#homeIntro1").html( overviewData[i].start + '-' +overviewData[i].end + '<br>' + overviewData[i].location ); // Brief info
            $('#readMore').css('opacity', 1);
            $("#bg"+current).css('opacity', 1); // Show the background picture of the seleted movement
              
            for(var j = 0; j < overviewData.length; j++ ){
                if(i!== j){$("#bg"+j).css('opacity', 0);} // Hide other background pictures
            }
          })
          .mouseout(function (d, i, datum) { // Return to normal state when mouseout
             $("#movTitle").html('');
              $("#homeIntro1").html( "This library guide is focused on books about key avant-garde movements and practices.We have selected the most popular books under each category.For other art movements, full collection of books and other types of resources, please go to ");
              $("#homeIntro1").append("<a href='http://www.monash.edu/library'>Monash library website</a>");
             $('#readMore').css('opacity', 0);
          })
          .click(function(d, i, datum){
            current = i; // Which movement is it?
            sessionStorage.setItem('current', i); // Store the value of this var so that it can be used in another page
            window.location.href = "individual_movement.html"; // Jumpt to detail page
          })
        
        var svg = d3.select("#timeline").append("svg").attr("width", width)
          .datum(timelineArray).call(chart);
      }
    
    
    timeline();
    books();
    
    
    
    //---------------- Initialize the fullpage library -------------------
    $('#fullpage').fullpage({
                scrollBar: false
            });
}


//---------------- Drawing d3 force layout -------------------
function books(){
    var   w = 0.7 * windowW,
          h =  windowH,
          coverH = 0.1 * windowW;


    var nodes = [
          { name: "Parent" },
          { name: "child1" },
          { name: "child2" },
          { name: "child3" },
          { name: "child4" },
          { name: "child5" }
    ];
    

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

    var myChart = d3.select('#books')
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


//    node.append('text')
//          .text(function(d, i){
//            return mainList[i].title;
//        })
//          .attr('x', function(d) { return d.x; })
//          .attr('y', function(d) { return d.y; })
//          .style('cursor','pointer')
//          .on('click', function(e) {})

    // Ugly with text. But leave it here for debugging.
    
    node.append('image')
          .attr('x', function(d) { return d.x; })
          .attr('y', function(d) { return d.y; })
          .attr('height', coverH )
          .style('cursor','pointer')
           .attr('href',function(d, i){
            return mainList[i].cover;
            })
           .on('click', function(d,i){setInfo(i)})
           .on('mouseenter', function(d,i){ 
                d3.select(this).style('opacity', 0.5);
                $('#bookTitlesm').html(mainList[i].title);
            })
           .on('mouseout', function(d){ 
                d3.select(this).style('opacity', 1);
                $('#bookTitlesm').html('');
            })


    force.on('tick', function(e) { // So that locations of elements update
        node.attr('transform', function(d, i) {
            return 'translate('+ d.x +', '+ d.y +')';
        })

    })


    force.start(); // Execute
}



function closeInfo(){
    $('#bookInfo').css('visibility', 'hidden');
}

function setInfo(a){ // Display the info of a certain book
    $('h3').html(mainList[a].title);
    $('#author').html(mainList[a].author);
    $('#availability').html(mainList[a].availability);
    $('#bookInfo').css('visibility', 'visible');
}

