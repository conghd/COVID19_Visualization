import * as React from 'react'
import { Component } from 'react';
import { useState, useEffect } from 'react';
import * as d3 from 'd3';
import { useD3 } from '../hooks/useD3';

const Timeline = ({data, myFunc }) => {
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

        const brushGroup = d3
            .select("svg")
            .append("g")
            .classed("brush", true);

        const brushX = d3.brushX().extent([0, 0], [600, 50])
        brushGroup.call(brushX);

    }, [data.length])

    return (
        <svg width="600" height="100" id="idtimeline" ref={ref}/>
    )

}

export default Timeline;