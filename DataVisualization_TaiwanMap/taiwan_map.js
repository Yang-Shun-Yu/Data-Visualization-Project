function renderTaiwanMap() {
    let taiwanCenterX = 124;
    let taiwanCenterY = 23.5;
    let taiwanScale = 4500;
    const lowDetailDataUrl = "https://raw.githubusercontent.com/Yang-Shun-Yu/Data-Visualization-Project/master/FinalProject/COUNTY_MOI_1090820.json";
    const highDetailDataUrl = "https://raw.githubusercontent.com/Yang-Shun-Yu/Data-Visualization-Project/master/FinalProject/T.json";
    let lowDetailData;
    let highDetailData;
    let flagLarge = false;
    let flagSmall = false;

    const svgContainer = d3.select("#svg3")
        .style("background-color", "#003D79")
        .style("cursor", "grab");

    const svg = svgContainer.append("g");
    const g = svg.append("g");

    const zoom = d3.zoom()
        .on("zoom", handleZoom)
        .on("start", function () { svgContainer.style("cursor", "grabbing"); })
        .on("end", function () { svgContainer.style("cursor", "grab"); });
    svgContainer.call(zoom);

    const initialScale = taiwanScale;
    const projectMethod = d3.geoMercator()
        .center([taiwanCenterX, taiwanCenterY])
        .scale(initialScale);
    const pathGenerator = d3.geoPath()
        .projection(projectMethod);

    d3.json(lowDetailDataUrl)
        .then(function (jsonData) {
            lowDetailData = topojson.feature(jsonData, jsonData.objects["COUNTY_MOI_1090820"]);
            renderTaiwanLowDetail(g);
        });

    d3.json(highDetailDataUrl)
        .then(function (jsonData) {
            highDetailData = topojson.feature(jsonData, jsonData.objects["TOWN_MOI_1120825"]);
        });
    //draw the livingfunction
    var projection = d3.geoMercator().center([taiwanCenterX, taiwanCenterY]).scale(taiwanScale);
    d3.csv("https://raw.githubusercontent.com/Yang-Shun-Yu/Data-Visualization-Project/master/FinalProject/%E5%85%A8%E5%9C%8B%E9%81%8B%E5%8B%95%E5%A0%B4%E9%A4%A8%E8%B3%87%E8%A8%8A.csv")
        .then(csvData => {
            livingfunctionsData = csvData;
            console.log(livingfunctionsData);
            renderlivingfunctions(g);
        })
        .catch(error => {
            console.error("Error loading CSV data:", error);
        });

    function renderTaiwanLowDetail(g) {
        g.selectAll("path")
            .data(lowDetailData.features)
            .enter()
            .append("path")
            .attr("d", pathGenerator)
            .attr("class", "town")
            .append("title")
            .text(function (d) { return d.properties["COUNTYNAME"]; });
    }

    function renderTaiwanHighDetail(g) {
        g.selectAll("path")
            .data(highDetailData.features)
            .enter()
            .append("path")
            .attr("d", pathGenerator)
            .attr("class", "country")
            .append("title")
            .text(function (d) { return d.properties["TOWNNAME"]; });
    }

    function renderlivingfunctions(g) {
        g.selectAll("circle")
            .data(livingfunctionsData)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return projection([+d["經度"], +d["緯度"]])[0];
            })
            .attr("cy", function (d) {
                return projection([+d["經度"], +d["緯度"]])[1];
            })
            .attr("r", 0.08)
            .attr("class", "circle")
            .append("title")
            .text(d => d["場館名稱"]);
    }

    function handleZoom(event) {
        const currentScale = event.transform.k;
        const thresholdScale = 5;
        if (currentScale < thresholdScale && !flagSmall) {
            svg.selectAll("path").remove();
            svg.selectAll("circle").remove();
            renderTaiwanLowDetail(g);
            renderlivingfunctions(g);
            flagSmall = true;
            flagLarge = false;
        } else if (currentScale >= thresholdScale && !flagLarge) {
            svg.selectAll("path").remove();
            svg.selectAll("circle").remove();
            renderTaiwanHighDetail(g);
            renderlivingfunctions(g);
            flagLarge = true;
            flagSmall = false;
        }
        g.attr("transform", event.transform);
    }
}
