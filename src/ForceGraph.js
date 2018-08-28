import React, { Component } from "react";
import Graph from "react-graph-vis";
import VisHighlight from "./VisHighlight";

let network;

class ForceGraph extends Component {
  constructor() {
    super();
    this.state = {
      drag: false,
      options: {
        layout: {
          // hierarchical: true,
        },
        edges: {
          color: "#000000"
        },
        nodes: {
          color: "#888f99"
        },
        physics: {
          enabled: true
        },
        interaction: {
          multiselect: true,
          dragView: true
        }
      },
      graph: {
        nodes: [
          {
            id: 1,
            label: "Node 1"
          },
          {
            id: 2,
            label: "Node 2"
          },
          {
            id: 3,
            label: "Node 3"
          },
          {
            id: 4,
            label: "Node 4"
          },
          {
            id: 5,
            label: "Node 5"
          }
        ],
        edges: [
          {
            from: 1,
            to: 2
          },
          {
            from: 1,
            to: 3
          },
          {
            from: 2,
            to: 4
          },
          {
            from: 2,
            to: 5
          }
        ]
      },
      selectedNodes: []
    };
    this.canvasWrapperRef = React.createRef();
  }

  componentDidMount() {
    network = this.canvasWrapperRef.current.Network;
  }

  events = {
    selectNode: e => {
      // update selectedNodes in state
      const currentNodes = network.getSelectedNodes();
      this.setState({
        selectedNodes: currentNodes
      });
    }
  };

  render() {
    return (
      <div
        id="graph"
        // style={{
        //   height: "100vh"
        // }}
      >
        <VisHighlight
          canvasWrapperRef={this.canvasWrapperRef}
          nodes={this.state.graph.nodes}
        >
          <Graph
            ref={this.canvasWrapperRef}
            graph={this.state.graph}
            options={this.state.options}
            events={this.events}
          />
        </VisHighlight>
      </div>
    );
  }
}

export default ForceGraph;
