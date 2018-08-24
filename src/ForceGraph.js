import React, { Component } from "react";
import Graph from "react-graph-vis";

let ctx;
let network;
let container;
let canvas;
let nodes;
let rect = [];
let drag = false;
var drawingSurfaceImageData;

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
      }
    };
    this.canvasWrapperRef = React.createRef();
  }

  componentDidMount() {
    // ref on graph <Graph/> to add listeners to, maybe?
    console.log("ref:", this.canvasWrapperRef.current.Network.body.nodes);

    container = this.canvasWrapperRef.current.Network.canvas.frame;
    network = this.canvasWrapperRef.current.Network;
    canvas = this.canvasWrapperRef.current.Network.canvas.frame.canvas;
    nodes = this.state.graph.nodes;
    ctx = canvas.getContext("2d");

    container.oncontextmenu = function() {
      return false;
    };

    this.saveDrawingSurface();

    // add event watching for canvas box drawing
    container.addEventListener("mousedown", e => {
      e.preventDefault();

      if (e.button == 2) {
        this.saveDrawingSurface();
        rect.startX =
          e.pageX -
          this.canvasWrapperRef.current.Network.body.container.offsetLeft;
        rect.startY =
          e.pageY -
          this.canvasWrapperRef.current.Network.body.container.offsetTop;
        this.state.drag = true;
        container.style.cursor = "default";
        this.selectNodesFromHighlight();
      }
    });

    container.addEventListener("mousemove", e => {
      if (this.state.drag) {
        this.restoreDrawingSurface();
        rect.w =
          e.pageX -
          this.canvasWrapperRef.current.Network.body.container.offsetLeft -
          rect.startX;
        rect.h =
          e.pageY -
          this.canvasWrapperRef.current.Network.body.container.offsetTop -
          rect.startY;

        ctx.setLineDash([5]);
        ctx.strokeStyle = "rgb(0, 102, 0)";
        ctx.strokeRect(rect.startX, rect.startY, rect.w, rect.h);
        ctx.setLineDash([]);
        ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
        ctx.fillRect(rect.startX, rect.startY, rect.w, rect.h);
        console.log("it's movin");
      }
    });

    container.addEventListener("mouseup", e => {
      if (e.button == 2) {
        this.restoreDrawingSurface();
        this.state.drag = false;
        container.style.cursor = "default";
        this.selectNodesFromHighlight();
        console.log("mouse up");
      }
    });
  }

  saveDrawingSurface() {
    drawingSurfaceImageData = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );
  }

  restoreDrawingSurface() {
    ctx.putImageData(drawingSurfaceImageData, 0, 0);
  }

  selectNodesFromHighlight() {
    var fromX, toX, fromY, toY;
    var nodesIdInDrawing = [];
    var xRange = this.getStartToEnd(rect.startX, rect.w);
    var yRange = this.getStartToEnd(rect.startY, rect.h);
    var allNodes = nodes;
    console.log(
      "selectNodesFromHigh",
      xRange,
      yRange,
      allNodes,
      allNodes.length
    );
    for (var i = 0; i < allNodes.length; i++) {
      var curNode = allNodes[i];
      var nodePosition = network.getPositions([curNode.id]);
      var nodeXY = network.canvasToDOM({
        x: nodePosition[curNode.id].x,
        y: nodePosition[curNode.id].y
      });
      console.log("for each node", curNode, nodePosition, nodeXY);
      if (
        xRange.start <= nodeXY.x &&
        nodeXY.x <= xRange.end &&
        yRange.start <= nodeXY.y &&
        nodeXY.y <= yRange.end
      ) {
        console.log("node added", curNode.id, nodesIdInDrawing);
        nodesIdInDrawing.push(curNode.id);
      }
    }
    network.selectNodes(nodesIdInDrawing);
  }

  getStartToEnd(start, theLen) {
    return theLen > 0
      ? {
          start: start,
          end: start + theLen
        }
      : {
          start: start + theLen,
          end: start
        };
  }

  events = {
    click: event => {
      console.log("click:", event.event);
    },
    dragStart: event => {
      console.log("dragStart:", event.event.center.x, event.event.center.y);
    },
    dragEnd: event => {}
  };

  render() {
    return (
      <div
        id="graph"
        style={{
          height: "100vh"
        }}
      >
        <Graph
          ref={this.canvasWrapperRef}
          graph={this.state.graph}
          options={this.state.options}
          events={this.events}
        />
      </div>
    );
  }
}

export default ForceGraph;
