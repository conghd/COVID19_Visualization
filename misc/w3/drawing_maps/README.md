
## Notes
let projection = d3. geoMercator()

let geoPath = d3.geoPath()
    .projection(projection)

chart.selectAll("path")
    .data(geoJsonData.features)
    .enter()
    .append("path")
    .attr(d", geoPath)


Drawing maps
    projection
    geopath
