import React, { Component } from "react";

let container;
let canvas;
let network;
let nodes;
let ctx;
let rect = [];
let drag = false;
var drawingSurfaceImageData;

class VisHightlight extends Component {
  state = {
    drag: false
  };

  componentDidMount() {
    container = this.props.canvasWrapperRef.current.Network.canvas.frame;
    network = this.props.canvasWrapperRef.current.Network;
    canvas = this.props.canvasWrapperRef.current.Network.canvas.frame.canvas;
    nodes = this.props.nodes;
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
          this.props.canvasWrapperRef.current.Network.body.container.offsetLeft;
        rect.startY =
          e.pageY -
          this.props.canvasWrapperRef.current.Network.body.container.offsetTop;
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
          this.props.canvasWrapperRef.current.Network.body.container
            .offsetLeft -
          rect.startX;
        rect.h =
          e.pageY -
          this.props.canvasWrapperRef.current.Network.body.container.offsetTop -
          rect.startY;

        ctx.setLineDash([5]);
        ctx.strokeStyle = e.altKey ? "rgb(255, 0, 0)" : "rgb(0, 102, 0)"; // update this with actual theme colors when added to Synapse
        ctx.strokeRect(rect.startX, rect.startY, rect.w, rect.h);
        ctx.setLineDash([]);
        ctx.fillStyle = e.altKey
          ? "rgba(255, 0, 0, 0.2)"
          : "rgba(0, 255, 0, 0.2)"; // update this with actual theme colors when added to Synapse
        ctx.fillRect(rect.startX, rect.startY, rect.w, rect.h);
      }
    });

    container.addEventListener("mouseup", e => {
      if (e.button == 2) {
        this.restoreDrawingSurface();
        this.state.drag = false;
        container.style.cursor = "default";
        this.selectNodesFromHighlight(e.altKey);
      }
    });

    document.addEventListener("keydown", e => {
      e.preventDefault();
      if (e.shiftKey) {
        if (e.which === 69) console.log("go back to the last table"); /// back to last table
        if (e.which === 81) console.log("unpin the selected nodes"); /// unpin
      } else {
        if (e.which === 69) console.log("explore the selected node"); /// explore
        if (e.which === 81) console.log("pin the selected nodes"); /// pin
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

  selectNodesFromHighlight(isAltDown) {
    var fromX, toX, fromY, toY;
    var nodesIdInDrawing = [];
    var xRange = this.getStartToEnd(rect.startX, rect.w);
    var yRange = this.getStartToEnd(rect.startY, rect.h);
    var allNodes = nodes;
    for (var i = 0; i < allNodes.length; i++) {
      var curNode = allNodes[i];
      var nodePosition = network.getPositions([curNode.id]);
      var nodeXY = network.canvasToDOM({
        x: nodePosition[curNode.id].x,
        y: nodePosition[curNode.id].y
      });
      if (
        xRange.start <= nodeXY.x &&
        nodeXY.x <= xRange.end &&
        yRange.start <= nodeXY.y &&
        nodeXY.y <= yRange.end
      ) {
        nodesIdInDrawing.push(curNode.id);
      }
    }
    // update selectedNodes in state
    const currentNodes = network.getSelectedNodes();
    if (!isAltDown) {
      // if the alt key is not down, add to the selection
      network.selectNodes([...currentNodes, ...nodesIdInDrawing]);
      // this.setState({
      //   selectedNodes: currentNodes
      // });
    } else if (isAltDown) {
      // if the alt key is down, remove from the selection
      const nodesAfterRemoved = currentNodes.filter(id => {
        return !(nodesIdInDrawing.indexOf(id) > -1);
      });
      network.selectNodes(nodesAfterRemoved);
    }
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

  render() {
    const { canvasWrapperRef } = this.props;
    return (
      <div
        style={{
          height: "100vh"
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

export default VisHightlight;
