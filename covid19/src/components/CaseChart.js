import * as React from 'react'
import { Component } from 'react';
import { useState, useEffect } from 'react';
import * as d3 from 'd3';
import geoJSON from './countries.geo.json'
import { useD3 } from '../hooks/useD3';
import "./Map.css";

const CaseChart = ({ data, myFunc}) => {
    useEffect(() => {
    }, [data]);

    const ref = useD3((svg) => {
        const width = svg.node().getBoundingClientRect().width;
        const height = svg.node().getBoundingClientRect().height;
        //let svg = d3.select("#caseChart")
        let margin = {
            top: 10,
            bottom: 30,
            left: 30,
            right: 10
        }
        let bodyHeight = height - margin.top - margin.bottom;
        let bodyWidth = width - margin.left - margin.right;
        console.log(bodyWidth + ", " + bodyHeight)
        svg.attr("width", width)
            .attr("height", height)

        var parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ")

        data = data.map(d => {
            let total = +d.total
            total = total >= 0 ? total: -total 
            return {date: parseTime(d.date), total: total}
        })
        console.log(data)

        let dates = data.map(d => d.date).sort((a, b) => {return d3.descending(a.date, b.date)})
        
        let maxTotal = d3.max(data, d => d.total)
        let barWidth = bodyWidth / data.length

        console.log("max: " + maxTotal)

        let xScale =
            d3.scaleTime()
              .range([0, bodyWidth])
              .domain(d3.extent(data, d => d.date))

        let yScale =
            d3.scaleLinear()
              .range([0, bodyHeight])
              .domain([maxTotal, 0])

        let axisX = d3.axisBottom(xScale)
            .ticks(5)

        // Draw bars
        let body = d3.select("#gcasechart")
        var bar = body.selectAll("rect")
            .data(data, d => d.total)
            .enter().append("rect")
            .style("transform", (d, i) => `translate(${margin.left + i * barWidth }px,${ margin.top}px)`)

        bar.attr("y", d => bodyHeight- yScale(d.total))
            .attr("width", barWidth )
            .attr("height", d => yScale(d.total))
            .attr("fill", "#eed202")

        svg.append("g")
            .style("transform",
                `translate(${margin.left}px,${height - margin.bottom}px)`
            )
            .call(axisX)

        let fm = d3.format(".2s")
        let yAxis = d3.axisLeft(yScale)
            .tickFormat(d => { return fm(d).replace('million', 'M') } );
        svg.append("g")
            .style("transform",
                `translate(${margin.left}px, ${margin.top}px)`
            )
            .call(yAxis)
        
        /*
        */

    }, [data.length]);

    return (
        <>
        <svg id="caseChart" ref={ref} width="100%" height="100%">
            <g id="gcasechart"></g>
        </svg>
        <div id="tooltip"></div>
        </>
    );
}

export default CaseChart;