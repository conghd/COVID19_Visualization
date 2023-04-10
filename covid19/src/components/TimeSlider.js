import React from "react";
import RangeSlider from "data-driven-range-slider";

class TimeSlider extends React.Component {
  constructor(props) {
    super(props);
    this.createDiagram = this.createDiagram.bind(this);
  }

  state = {
    selectedRange: [],
    selectedData: []
  };
 
  componentDidMount() {
    this.createDiagram();
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.data == this.props.data){
      return;
    }
    this.createDiagram();
  }

  render() {
    return (
      <div>
        <div>
          selected range  {this.state.selectedRange.length &&
            this.state.selectedRange[0].toLocaleDateString("en")}{" "}
          ,{" "}
          {this.state.selectedRange.length &&
            this.state.selectedRange[1].toLocaleDateString("en")}
        </div>
        <div>selected data length - {this.state.selectedData.length} </div>
        <div
          style={{
            marginTop: "50px",
            borderRadius: "5px",
            paddingTop: "30px",
            paddingLeft: "20px",
            backgroundColor: "#30363E"
          }}
          ref={node => (this.node = node)}
        />
      </div>
    );
  }

  createDiagram() {
    const node = this.node;
    if (!this.props.data) {
      return;
    }
    if (!this.chart) {
      this.chart = new RangeSlider();
    }
    this.chart
      .container(node)
      //.svgWidth(window.innerWidth - 50)
      .svgWidth(500)
      .svgHeight(100)
      .data(this.props.data)
      .accessor(d => new Date(d))
      .onBrush(d => {
        this.setState({
          selectedRange: d.range,
          selectedData: d.data
        });
      })
      .render();
  }
}

export default TimeSlider;
