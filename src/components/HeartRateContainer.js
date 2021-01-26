import React from "react";
import {Helmet} from "react-helmet";

class HeartRateContainer extends React.Component {
  render() {
    return (
	<div>
	    <Helmet>
		<script src="https://webrtc.github.io/adapter/adapter-5.0.4.js"></script>
		<script src="/utils.js" type="text/javascript"></script>
		<script src="/processVideo.js" type="text/javascript"></script>
		<script src="/fft.js"></script>
	    </Helmet>
	    <div className="control"><button id="startAndStop" disabled>Start</button></div>
	    <p id="heartrate">Calibrating...</p>
	    <div>
		
		<table cellPadding="0" cellSpacing="0" width="0" border="0">
		    <thead>
			<tr>
			    <td>
				<video id="videoInput" width="320" height="240"></video>
			    </td>
			</tr>
		    </thead>
		    <tbody>
			<tr>
			    <td>
				<div className="caption">videoInput</div>
			    </td>
			</tr>
		    </tbody>
		</table>
	    </div>
	    <p className="err" id="errorMessage"></p>
	</div>
    )
  }
}
export default HeartRateContainer
