import * as React from 'react'
import { Component } from 'react';
import { useState, useEffect } from 'react';
import * as d3 from 'd3';
import { useD3 } from '../hooks/useD3';
import './Timeline.css';

const Timeline = ({data, myFunc }) => {
    const ref = useD3((svg) => {
        const brushElement = d3.select("#mybrush")
        const axisElement = d3.select("#myaxis")
        const parentWidth = svg.node().getBoundingClientRect().width;
        const parentHeight = svg.node().getBoundingClientRect().height;
        const margin = ({top: 10, right: 0, bottom: 20, left: 0})
        const width = parentWidth - margin.left - margin.right;
        const height = parentHeight - margin.top - margin.bottom;

        const x = d3.scaleTime()
            .domain([new Date(2019, 1, 1), new Date(2019, 8, width / 60) - 1])
            .rangeRound([margin.left, width - margin.right])

    }, [data.length])

    return (
        <div className="svg-container">
            <svg id="idtimeline" className="svg-content" ref={ref}>
                <g id="mybrush"></g>
                <g id="myaxis"></g>
            </svg>
        </div>
    )

}

export default Timeline;