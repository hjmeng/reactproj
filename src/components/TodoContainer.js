import React from "react";
import {Helmet} from "react-helmet";

class TodoContainer extends React.Component {
  render() {
    return (
	<div>
	    <Helmet>
		<script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0"></script>
		<script src="/fft.js"></script>
		<script src="/copy.js"></script>
	    </Helmet>
            <h1>Hello HeartRate with Live Video</h1>
	    <canvas id="output" ></canvas>
	    <video hidden playsInline autoPlay></video>
	    <p id="heartrate">Calibrating...</p>
	    <canvas id="myChart" height="70%"></canvas>
	</div>
    )
  }
}
export default TodoContainer
