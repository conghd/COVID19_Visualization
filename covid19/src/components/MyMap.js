import * as React from 'react'
import { Component } from 'react';
import { useState, useEffect } from 'react';
import * as d3 from 'd3';
import geoJSON from './countries.geo.json'
import { useD3 } from '../hooks/useD3';
import "./Map.css";

const MyMap = ({ data, myFunc}) => {
    const ref = useD3((svg) => {
        const width = svg.node().getBoundingClientRect().width;
        const height = svg.node().getBoundingClientRect().height;
        console.log("width: " + width + ", height: " + height);

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
        var map = d3.select("g")

        d3.select(".overlay")
            .attr("width", width)
            .attr("height", height);

        console.log("scaleExtent: " + scaleExtent);
        console.log("projection.scale(): " + projection.scale())
        var zoom = d3.zoom()       // Set up zoom
            .scaleExtent(scaleExtent)
            .on("zoom", handlePanZoom2);
        zoom.scaleTo(svg.transition().duration(0), projection.scale());
        svg.call(zoom);                     // Attach zoom event

        console.log(geoJSON);

        map.selectAll('path')
            .data(geoJSON.features)
            .enter()
            .append('path');
        
        myrender();

        // The following variables track the last processed event.
        var translateLast = [0,0];
        var scaleLast     = null;

        function myrender() {
            map.selectAll('path')       // Redraw all map paths
                .attr('d', path);

            map.selectAll('path').filter((d, i) => {
                return i === 21;
            }).style("fill", 'none');
        }

        function handlePanZoom2(e) {
            console.log("handlePanZoom");
                // Handle pan and zoom events

            var transform = d3.zoomTransform(this);
            console.log(e.transform);

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
                console.log("tp0: " + tp[0] + ", tp1: " + (tp[1]+ delta[1]));

                projection.translate ([ tp[0], tp[1] + delta[1] ]);
            }

            // Store the last transform values. NOTE: Resetting zoom.translate() and zoom.scale()
            // would seem equivalent, but it doesn't seem to work reliably.
            scaleLast = scale;
            translateLast = translate;

            myrender();
        }

    }, []);

    return (
        <svg id="map" ref={ref} width="100%" height="100%">
            <g></g>
            <rect className="overlay" ></rect>
        </svg>
    );
}

export default MyMap;