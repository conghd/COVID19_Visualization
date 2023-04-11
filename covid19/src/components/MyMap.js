import * as React from 'react'
import { Component } from 'react';
import { useState, useEffect } from 'react';
import * as d3 from 'd3';
import geoJSON from './countries.geo.json'
import { useD3 } from '../hooks/useD3';
import "./Map.css";

const MyMap = ({ data, myFunc}) => {

    useEffect(() => {
    }, [data]);

    const ref = useD3((svg) => {
        const width = svg.node().getBoundingClientRect().width;
        const height = svg.node().getBoundingClientRect().height;

        // getMapProjection
        const initialLongitude = -95;            // Initial longitude to center
        var latitudeBounds = [ -80, 84 ];      // Maximum latitude to display
        var projection = d3.geoMercator()
            .rotate([-initialLongitude, 0])
            .scale(1)
            .translate([width / 2, height / 2 + 0])

        var viewMin = [ 0, 0 ];
        var viewMax = [ 0, 0 ];

        function updateProjectionBounds () {
            // Updates the view top left and bottom right with the current projection.
            var yaw = projection.rotate()[0];
            var longitudeHalfRotation = 180.0 - 1e-6;

            viewMin = projection([-yaw - longitudeHalfRotation, latitudeBounds[1]]);
            viewMax = projection([-yaw + longitudeHalfRotation, latitudeBounds[0]]);
        }

        updateProjectionBounds();

        // Set up the scale extent and initial scale for the projection.
        var s = width / (viewMax[0] - viewMin[0]);
        var scaleExtent = [s, 50*s];        // The minimum and maximum zoom scales

        projection
            .scale(scaleExtent[0]);         // Set up projection to minimium zoom

        // drawBaseMap
        let path = d3.geoPath()
            .projection(projection)

        svg.attr("width", width)
           .attr("height", height);
        var map = d3.select("#gmap")

        d3.select(".overlay")
            .attr("width", width)
            .attr("height", height);

        var zoom = d3.zoom()       // Set up zoom
            .scaleExtent(scaleExtent)
            .on("zoom", handlePanZoom2);
        zoom.scaleTo(svg.transition().duration(0), projection.scale());
        svg.call(zoom);                     // Attach zoom event


        map.selectAll('path')
            .data(geoJSON.features)
            .enter()
            .append('path')
        .on("mouseover", (d, i) => {

            d3.select(this).transition().duration('50').attr("opacity", '0.85');
            console.log("mouseenter");
            ///showTooltip(d, [e.event.pageX, e.event.pageY])
        })
        .on("mouseleave", (d, i) => {
            console.log("path::mouseleave")

        })
        
        
        
        // Calculate radius
        console.log(data)
        let maxCnt = d3.max(data, item => +item.total)
        let maxRadius = 20
        let populationScale = d3.scaleSqrt()
            .domain([0, maxCnt])
            .range([0, maxRadius])
        // draw countries
        let gdata = d3.select("#gdata")
        gdata.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        //.attr("r", 5)
        .attr("r", d => populationScale(+d.total))
        .attr("opacity", 0.9)
        //.attr("cx", d => projection([+d.long, +d.lat])[0])
        //.attr("cy", d => projection([+d.long, +d.lat])[1])
        .attr("fill", "#eed202")
        .on("mouseover", (e, d) => {
            d3.select(this).transition().duration('50').attr("opacity", '0.85');
            //console.log("mouseenter");
            showTooltip(d, [d3.pointer(e)[0], d3.pointer(e)[1]])
        })
        .on("mouseleave", (e, d) => {
            //console.log("mouseleave");
            d3.select("#tooltip").style("display", "none")

        })
        .on("click", d => {
            console.log("click");
        })
        
        //===== LEGEND =========
        let radiusArr = []
        let caseLegends = [0, 1000000, 4000000, 8000000, 15000000, 25000000, 50000000]
        let glegend = d3.select("#glegend")
        for (let i = 0; i < caseLegends.length-1; i++) {
            radiusArr.push({"r": populationScale(0.5 * caseLegends[i + 1] + 0.5*caseLegends[i]) || 0, "low": caseLegends[i],
                        "cx": 30, "cy": 420 - i * 22, "high": (i == caseLegends.length-2) ? null : caseLegends[i+1]})
        }
        glegend.selectAll("circle").data(radiusArr).enter().append("circle")
            .attr("cx", d => d.cx).attr("cy", d => d.cy).style("fill", "#eed202")

        glegend.selectAll("text").data(radiusArr).enter().append("text")
            .attr("x", d => d.cx + 25).attr("y", d => d.cy)
            .text(d => `${d3.format("~s")(d.low)} ~ ${d.high ? d3.format("~s")(d.high) : ""}`).style("font-size", "13px").style("color", "gray").attr("alignment-baseline","middle")

        //========================
        myrender();


        d3.select('#zoom-in').on('click', function() {
            // Smooth zooming
              zoom.scaleBy(svg.transition().duration(750), 1.3);
          });
          
          d3.select('#zoom-out').on('click', function() {
            // Ordinal zooming
            zoom.scaleBy(svg.transition().duration(750), 1 / 1.3);
          });

        function showTooltip(d, coords) {
            let text = `<b>${d.city || d.province || d.country}</b><br/>\
            Confirmed cases: ${d3.format(",")(d.total)}`;
            d3.select("#tooltip").html(text)
                .style("display", "block")
                .style("top", `${coords[1] + 10}px`)
                .style("left", `${coords[0] + 10}px`)

        }
        // The following variables track the last processed event.
        var translateLast = [0,0];
        var scaleLast     = null;

        function myrender() {
            map.selectAll('path')       // Redraw all map paths
                .attr('d', path);

            map.selectAll('path').filter((d, i) => {
                return i === 21;
            }).style("fill", 'none');

            gdata.selectAll("circle")
                .attr("cx", d => projection([+d.long, +d.lat])[0])
                .attr("cy", d => projection([+d.long, +d.lat])[1])

            glegend.selectAll("circle").attr("cx", d => d.cx).attr("cy", d => d.cy).attr("r", d => d.r)
            glegend.selectAll("text").attr("x", d => d.cx + 25).attr("y", d => d.cy)

        }

        function handlePanZoom2(e) {
            console.log("handlePanZoom");
                // Handle pan and zoom events

            var transform = d3.zoomTransform(this);

            var translate = [transform.x, transform.y];
            var scale = transform.k;
        
            // If the scaling changes, ignore translation (otherwise touch zooms are weird).
            var delta = [ translate[0] - translateLast[0], translate[1] - translateLast[1] ];
            if (scale != scaleLast) {
                projection.scale(scale);
            } else {
                var longitude = projection.rotate()[0];
                var tp = projection.translate();
        
                // Use the X translation to rotate, based on the current scale.
                longitude += 360 * (delta[0] / width) * (scaleExtent[0] / scale);
                projection.rotate ([longitude, 0, 0]);

                // Use the Y translation to translate projection, clamped by min/max
                updateProjectionBounds();

                if (viewMin[1] + delta[1] > 0)
                    delta[1] = -viewMin[1];
                else if (viewMax[1] + delta[1] < height)
                    delta[1] = height - viewMax[1];

                //projection.translate ([ tp[0], tp[1] + delta[1] ]);
                //console.log("tp0: " + tp[0] + ", tp1: " + (tp[1]+ delta[1]));

                projection.translate ([ tp[0], tp[1] + delta[1] ]);
            }

            // Store the last transform values. NOTE: Resetting zoom.translate() and zoom.scale()
            // would seem equivalent, but it doesn't seem to work reliably.
            scaleLast = scale;
            translateLast = translate;

            myrender();
        }

    }, [data.length]);

    return (
        <>
        <svg id="map" ref={ref} width="100%" height="100%">
            <g id="gmap"></g>
            <g id="gdata"></g>
            <g id="glegend"></g>
            <rect className="overlay" ></rect>
            <g className="zoom-controls" transform="translate(10, 10)">
            <g id="zoom-in" transform="translate(0, 0)">
              <rect width="30" height="30"></rect>
              <line x1="5" y1="15" x2="25" y2="15"></line>
              <line x1="15" y1="5" x2="15" y2="25"></line>
            </g>
            <g id="zoom-out" transform="translate(30, 0)">
              <rect width="30" height="30"></rect>
              <line x1="5" y1="15" x2="25" y2="15"></line>
            </g>
            </g>
        </svg>
        <div id="tooltip"></div>
        </>
    );
}

export default MyMap;