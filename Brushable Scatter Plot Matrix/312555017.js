let width = 960;
let size = 230;
let padding = 20;

const x = d3.scaleLinear().range([padding/2,size-padding/2]);
const y = d3.scaleLinear().range([size - padding / 2, padding / 2]);

const xAxis = d3.axisBottom().scale(x).ticks(6);
const yAxis = d3.axisLeft().scale(y).ticks(6);

const color = d3.scaleOrdinal(d3.schemeCategory10);
console.log("color : ",color)

d3.csv("http://vis.lab.djosix.com:2023/data/iris.csv").then(function(data){

   
    const domainBySpecises = {};
    const species = Object.keys(data[0]).filter(function(d){return d!=="class";});//get the species name

    console.log(species);

    n = species.length;
    console.log(species);

    species.forEach(function(specie){
        domainBySpecises[specie] = d3.extent(data,function(d){return +d[specie];});
    })

    console.log(domainBySpecises);

    xAxis.tickSize(size*n);
    yAxis.tickSize(-size*n);
   
    const svg = d3.select("#my_svg").append("svg")
        .attr("width",size*(n+1)+padding)
        .attr("height",size*(n+1)+padding)
        .append("g")
        .attr("transform","translate("+padding+7+","+padding/2+")");

    svg.selectAll(".x.axis")
        .data(species)
        .enter()
        .append("g")
        .attr("class","x axis")
        .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * size + ",0)"; })
        .each(function(d) { x.domain(domainBySpecises[d]); d3.select(this).call(xAxis); });

    svg.selectAll(".y.axis")
        .data(species)
        .enter()
        .append("g")
        .attr("class", "y axis")
        .attr("transform", function(d, i) { return "translate(0," + i * size + ")"; })
        .each(function(d) { y.domain(domainBySpecises[d]); d3.select(this).call(yAxis); });


  

    const cell  = svg.selectAll(".cell")
        .data(cross(species,species))
        .enter()
        .append("g")
        .attr("class","cell")
        .attr("transform",function(d){return "translate("+(n-d.i-1)*size+","+d.j*size+")";})
        .each(plot)

    cell.filter(function(d) { return d.i === d.j; }).append("text")
        .attr("x", padding)
        .attr("y", padding + 20)
        .style("font-size", "12px")
        .text(function(d) { return "(" + d.x + ")"; });
  

    cell.filter(function(d) {  return d.i === n-1; }).append("text")
        .attr("x", padding-130)
        .attr("y", padding+90)
        .style("font-size", "16px")
        .text(function(d) { return d.y; });
  
    cell.filter(function(d) { return d.j === 0; }).append("text")
        .attr("x", padding+50)
        .attr("y", padding+950)
        .style("font-size", "16px")
        .text(function(d) { return d.x; });


    const brush = d3.brush()
        .on("start", brushstart)
        .on("brush", brushmove)
        .on("end", brushend)
        .extent([[0,0],[size,size]]);

    cell.call(brush);

    function cross(a, b) {
        var c = [];
        for (var i = 0; i < a.length; i++) {
            for (var j = 0; j < b.length; j++) {
            c.push({ x: a[i], i: i, y: b[j], j: j });
            }
        }
      
        return c;
    }


  
    function plot (p){
        // console.log(p);
        const cell = d3.select(this);
        x.domain(domainBySpecises[p.x])
        y.domain(domainBySpecises[p.y])
        

        cell.append("rect")
        .attr("class", "frame")
        .attr("x", padding / 2)
        .attr("y", padding / 2)
        .attr("width", size - padding)
        .attr("height", size - padding);

        const g = cell.append("g")
        .attr("class", "brushable");

        circle = cell.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) { return x(+d[p.x]); })
        .attr("cy", function(d) { return y(+d[p.y]); })
        .attr("r", 4)
        .style("fill", function(d) { console.log(color(d.class),d.class);return color(d.class); });


    }

    let brushCell;

    // Clear the previously-active brush, if any.
    function brushstart(event) {
        // console.log(event);
        

        let cellData = d3.select(this).datum();
        console.log("cellData",cellData);
        console.log(cellData.x)
        var p = d3.select(this).datum();
        
     
        // const xValue = x.invert(extent[0][0]);
        // const yValue = y.invert(extent[0][1])
     
        // console.log(event);
        // const range = event.selection;
        // console.log("range",range);
        // console.log("x",range[0][0]);
        // console.log("y",range[0][1]);

        
        

      if (brushCell !== this) {
        d3.select(brushCell).call(brush.move, null);
        brushCell = this;
        x.domain(domainBySpecises[p.x]);
        y.domain(domainBySpecises[p.y]);
      }
    }
  
    // Highlight the selected circles.
    function brushmove(event) {
      var e = d3.brushSelection(this);
    //   console.log("e ",e);
      var p = d3.select(this).datum();
    // console.log(p);
      svg.selectAll("circle").classed("hidden", function(d) {
        // console.log("d: ",d);
        // console.log("d p x",d[p.x]);
        // console.log("d x p x",x(+d[p.x]));
        return !e
          ? false
          : (
            e[0][0] > x(+d[p.x]) || x(+d[p.x]) > e[1][0]
            || e[0][1] > y(+d[p.y]) || y(+d[p.y]) > e[1][1]
          );
      });
    }
  
    // If the brush is empty, select all circles.
    function brushend() {
      var e = d3.brushSelection(this);
      if (e === null) svg.selectAll(".hidden").classed("hidden", false);
    }
  
    

})