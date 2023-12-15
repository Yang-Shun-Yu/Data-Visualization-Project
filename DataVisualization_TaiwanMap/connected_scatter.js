
// function renderConnectedScatter() {
//     var width;
//     var height;
//     // Wait for the DOM to be fully loaded
//     document.addEventListener('DOMContentLoaded', function () {
//         // Get the SVG element with id "svg1"
//         var svg1 = document.getElementById('svg1');

//         // Get the width and height of the SVG element
//         width = svg1.clientWidth;
//         height = svg1.clientHeight;

//         // Log or use the width and height as needed
//         console.log('Width of svg1:', width);
//         console.log('Height of svg1:', height);
//     });
//     // set the dimensions and margins of the graph
//     const margin = { top: 30, right: 30, bottom: 10, left: 50 };
//     width = width - margin.left - margin.right;
//     height = height - margin.top - margin.bottom;

//     // append the svg object to the body of the page
//     const svg = d3.select("#svg1")
//         .append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//         .attr("transform", `translate(${margin.left},${margin.top})`);

//     //Read the data
//     d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/connectedscatter.csv",
//         // When reading the csv, I must format variables:
//         function (d) {
//             return { date: d3.timeParse("%Y-%m-%d")(d.date), value: d.value }
//         }).then(
//             // Now I can use this dataset:
//             function (data) {
//                 height = height - 60;
//                 width = width - 50;
//                 // Add X axis --> it is a date format
//                 const x = d3.scaleTime()
//                     .domain(d3.extent(data, d => d.date))
//                     .range([0, width]);
//                 svg.append("g")
//                     .attr("transform", "translate(0," + height + ")")
//                     .call(d3.axisBottom(x));
//                 // Add Y axis
//                 const y = d3.scaleLinear()
//                     .domain([8000, 9200])
//                     .range([height, 0]);
//                 svg.append("g")
//                     .call(d3.axisLeft(y));
//                 // Add the line
//                 svg.append("path")
//                     .datum(data)
//                     .attr("fill", "none")
//                     .attr("stroke", "#69b3a2")
//                     .attr("stroke-width", 1.5)
//                     .attr("d", d3.line()
//                         .x(d => x(d.date))
//                         .y(d => y(d.value))
//                     )
//                 // Add the points
//                 svg
//                     .append("g")
//                     .selectAll("dot")
//                     .data(data)
//                     .join("circle")
//                     .attr("cx", d => x(d.date))
//                     .attr("cy", d => y(d.value))
//                     .attr("r", 5)
//                     .attr("fill", "#69b3a2")
//             })


// }


function renderConnectedScatter() {
    var width;
    var height;
    // Wait for the DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function () {
        // Get the SVG element with id "svg1"
        var svg1 = document.getElementById('svg1');

        // Get the width and height of the SVG element
        width = svg1.clientWidth;
        height = svg1.clientHeight;

        // Log or use the width and height as needed
        console.log('Width of svg1:', width);
        console.log('Height of svg1:', height);
    });
    d3.csv("https://raw.githubusercontent.com/Yang-Shun-Yu/Data-Visualization-Project/master/FinalProject/%E5%85%A8%E5%9C%8B%E9%81%8B%E5%8B%95%E5%A0%B4%E9%A4%A8%E8%B3%87%E8%A8%8A.csv")
        .then(csvData => {
            // Step 1: Group data by "縣市" and "場館啟用年"
            const groupedData = csvData.reduce((acc, current) => {
                const city = current.縣市;
                const year = current.場館啟用年;

                // If the city key doesn't exist in the accumulator, create an empty object
                if (!acc[city]) {
                    acc[city] = {};
                }

                // If the year key doesn't exist in the city object, create an empty array
                if (!acc[city][year]) {
                    acc[city][year] = [];
                }

                // Push the current data object to the corresponding year array
                acc[city][year].push(current);

                return acc;
            }, {});

            console.log(groupedData);
            // Step 2: Calculate the total number of objects for each combination of "縣市" and "場館啟用年"
            const totalObjectsData = Object.keys(groupedData).map(city => {
                // console.log(city);
                let sum = 0;
                return Object.keys(groupedData[city]).map(year => {
                    sum += groupedData[city][year].length;
                    // console.log(sum);
                    const totalObjects = sum;
                    if (year >= 60 && year % 5 == 0) {
                        return { city, year, totalObjects };
                    }


                });
            }).flat();

            console.log(totalObjectsData);

            // Step 3: Prepare the data for plotting
            const plotData = totalObjectsData
                .filter(d => d !== undefined)
                .map(d => ({
                    city: d.city,
                    year: +d.year, // Convert year to a number
                    totalObjects: d.totalObjects
                }));

            console.log(plotData);
            const tooltip = d3.select("#svg1").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);


            // Step 4: Use D3.js to create the connected scatter plot
            // set the dimensions and margins of the graph
            const margin = { top: 30, right: 30, bottom: 10, left: 50 };
            width = width - margin.left - margin.right;
            height = height - margin.top - margin.bottom;

            // append the svg object to the body of the page
            const svg = d3.select("#svg1")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);



            width = width - 50;
            height = height - 20;

            // Create scales for x and y axes
            const xScale = d3.scaleLinear().domain([d3.min(plotData, d => d.year), d3.max(plotData, d => d.year)]).range([0, width]);
            const yScale = d3.scaleLinear().domain([0, d3.max(plotData, d => d.totalObjects)]).range([height, 0]);

            // Create x and y axes
            const xAxis = d3.axisBottom(xScale);
            const yAxis = d3.axisLeft(yScale);

            // Append x and y axes to the SVG
            svg.append("g").attr("transform", `translate(0, ${height})`).call(xAxis);
            svg.append("g").call(yAxis);

            // Create a line generator for connecting points
            const line = d3.line()
                .x(d => xScale(d.year))
                .y(d => yScale(d.totalObjects));

            // Draw connected scatter plot



            // Use Set to store unique city names
            const uniqueCities = new Set(plotData.map(d => d.city));
            console.log(uniqueCities);

            // Convert Set to an array
            const allCities = Array.from(uniqueCities);

            // List of 22 different beautiful colors
            const colors = [
                "#c8110c", "#de24c5", "#b1738c", "#3d18da", "#4fc121", "#d18d26",
                "#1f5acc", "#7dd1fe", "#9e87c5", "#239783", "#5ff345", "#bff904",
                "#1cdb59", "#23b62e", "#222017", "#e715c0", "#286ae7", "#e27685",
                "#9a6a22", "#a5aac9", "#680bc3", "#d1eaa7"
            ];
            const cityColorMap = {};
            allCities.forEach((city, index) => {
                cityColorMap[city] = colors[index];
            });
            console.log(allCities);
            console.log(cityColorMap);


            allCities.forEach(city => {
                const cityData = plotData.filter(d => d.city === city);

                // Draw connected scatter plot
                const path = svg.append("path")
                    .datum(cityData)
                    .attr("fill", "none")
                    .attr("stroke", cityColorMap[city])
                    .attr("stroke-width", 1.5)
                    .attr("d", d3.line()
                        .x(d => xScale(d.year))
                        .y(d => yScale(d.totalObjects))
                    );

                // Add the points
                const circles = svg.append("g")
                    .selectAll("dot")
                    .data(cityData)
                    .join("circle")
                    .attr("cx", d => xScale(d.year))
                    .attr("cy", d => yScale(d.totalObjects))
                    .attr("r", 4)
                    .attr("fill", cityColorMap[city])
                    .on("mouseover", handleMouseOver)
                    .on("mouseout", handleMouseOut);

                // Function to handle mouseover event
                function handleMouseOver(event, d) {
                    // Change circle color on mouseover

                    d3.select(this).attr("fill", "red");
                    d3.select(this).transition().attr("r", 8);
                    // Add tooltip at mouse position
                    d3.select("#tooltip")
                        .html(`City: ${d.city}\nYear: ${d.year}\nTotal Objects: ${d.totalObjects}`)
                        .style("left", `${event.layerX + 10}px`)
                        .style("top", `${event.layerY + 10}px`)
                        .style("opacity", 1);
                }

                // Function to handle mouseout event
                function handleMouseOut(event, d) {
                    // Change color back to original on mouseout
                    d3.select(this).attr("fill", cityColorMap[city]);
                    d3.select(this).transition().duration(200).attr("r", 4);
                    // Hide tooltip on mouseout
                    d3.select("#tooltip").style("opacity", 0);
                    tooltip.transition().duration(500).style("opacity", 0);
                }
            });


        })
}