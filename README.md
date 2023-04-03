# CS736_Project1

## Database
    https://bit.io/conghd/covid19?tab=Data
    python3 -m http.server
D3 notes

D3 selection
    d3.select()
    d3.selectAll()

    selection.text()
    selection.html()

Changing content

Adding & Removing elements

Changing properties
    selection.attr(atrribute, value)
    d3.select("img").attr("src", "newLogo.png")
    selection.style(property, value)
    d3.select("p").style("color", "red")

Loading data
    d3.csv, d3.json

Filtering & Sorting
    data.filter(function(client) {
        return client.age < 25
    })

    array.sort(function (a, b) {
    })

    array.sort(d3.ascending)
    data.sort(function(c1, c2) {})
    data.sort((a, b) => {
        return d3.ascending(a.Name, b.Name)
    })

    let filteredData = data.filter(d => {
        return d.Weight < 200
    })

Transforming Data
    transform data into a new format
    let ages = array.map((client) => {
        return client.age
    })

    Reduce (sum, average)
    array.reduce(
        reducer,
        initValue
    )

    Reducer => function(accumulator, currValue, index, arr) {
        return newValue
    }

Computing Simple Statistics
    d3.max, d3.max(data, [, accesstor])
    d3.max(data, d => {
        return d.age
    })
    d3.min
    d3.extent(data [, accesstor])
        return [minimum, maximum]
    d3.sum(data, d => {
        return d.age;
    })

######
Drawing with data
SVG
    Graphic Elements
    <rect />, <circle>, <line />, <path />, <text />
    non-graphic elements: <g />, transform (translate, rotate), drawing order

Binding data
selection.data, d3.selectAll("li").data(data)
    .enter()

Numeric scales
    d3.scaleLinear().domain(domainExtent)
        range(destExtent)
    let scale = d3.scaleLiner()
                    .domain([0, 64])
                    .range([0, 300])
    let scale = d3.scaleSqrt().domain([0, 64]).range([0, 300])
    extent = [min, max]
    let max = d3.max(clients, d => d.Weight);
    let widthScale = d3.scaleLinear()
                       .range([0, 300])
                       .domain([0, max])

Ordinal scales
    let scale = d3.scaleOrdinal()
                  .domain(["A", "B", "C"])
                  .range([10, 8, 6])
    d3.scaleBand()
      .domain(domain)
      .range(extent)