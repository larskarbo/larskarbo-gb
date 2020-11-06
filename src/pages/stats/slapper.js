import React, { useEffect, useRef, useState } from "react"
import { graphql } from "gatsby"

import Layout from "../../components/layout"
import SEO from "../../components/seo"
import * as d3 from "d3";
import "./chart.css"
import ky from "ky";

const Slapper = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const [asdf, setAsdf] = useState("horse")
  const [anData, setAnData] = useState(null)

  useEffect(() => {
    console.log('qoi')
  }, [])

  useEffect(() => {
    ky("http://localhost:8888/.netlify/functions/weekly")
    .json()
    .then(asdf => {
      setAnData([
        ["",0],
        ["",0],
        ["",0],
        ["",0],
        ...asdf.data])
    })
  },[])

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="Slapper stats" />
      <h1>Slapper stats</h1>

      <h3>Beta users invited: <Thing num={9} /></h3>
      <h3>Beta users that used it: <Thing num={5} /></h3>
      <h3>Website visits: <Thing  num={anData && anData.reduce((a,c) => a+c[1], 0)} /></h3>
      <Chart data={anData} />

    </Layout>
  )
}

const Chart = ({ num, data }) => {

  const ref = useRef()
  
  useEffect(() => {
    if(!ref || !data){
      return
    }
    // 2. Use the margin convention practice 
    var margin = { top: 50, right: 50, bottom: 50, left: 50 }
      , width = 300 - margin.left - margin.right // Use the window's width 
      , height = 200 - margin.top - margin.bottom; // Use the window's height

    // The number of datapoints
    var n = data.length;

    const max = data.map(d => d[1]).reduce((a,c) => c>a ? c : a, 0)

    // 5. X scale will use the index of our data
    var xScale = d3.scaleLinear()
      .domain([0, n - 1]) // input
      .range([0, width]); // output

    // 6. Y scale will use the randomly generate number 
    var yScale = d3.scaleLinear()
      .domain([0, max]) // input 
      .range([height, 0]); // output 

    // 7. d3's line generator
    var line = d3.line()
      .x(function (d, i) { return xScale(i); }) // set the x values for the line generator
      .y(function (d) { return yScale(d.y); }) // set the y values for the line generator 
      // .curve(d3.curveMonotoneX) // apply smoothing to the line

    // 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
    var dataset = data.map(([_,y]) => ({y}))

    // 1. Add the SVG to the page and employ #2
    var svg = d3.select(ref.current).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // 3. Call the x axis in a group tag
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      // .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

    // 4. Call the y axis in a group tag
    svg.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

    // 9. Append the path, bind the data, and call the line generator 
    svg.append("path")
      .datum(dataset) // 10. Binds data to the line 
      .attr("class", "line") // Assign a class for styling 
      .attr("d", line); // 11. Calls the line generator 

    // 12. Appends a circle for each datapoint 
    svg.selectAll(".dot")
      .data(dataset)
      .enter().append("circle") // Uses the enter().append() method
      .attr("class", "dot") // Assign a class for styling
      .attr("cx", function (d, i) { return xScale(i) })
      .attr("cy", function (d) { return yScale(d.y) })
      .attr("r", 5)
      .on("mouseover", function (a, b, c) {
        console.log(a)
        console.log('this: ', this);
        // this.attr('class', 'focus')
      })
      .on("mouseout", function () { })
  }, [ref,data])
  return (
    <div ref={ref}></div>
  )
}

const Thing = ({ num }) => {
  return (
    <span style={{
      color: "#1c57c3"
    }}>{num}</span>
  )
}

export default Slapper

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
