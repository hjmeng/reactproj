//import logo from './logo.svg';
import './App.css';
import $ from 'jquery';


function App() {
/*
    function copyIframeContent() {
	var iframeContent = $(iframe).contents(); //alert(iframeContent);
	//$("#result").text("Hello World");
	$("#result").html(iframeContent.find('body').html);
	alert(iframeContent.find('body').html());
    }
*/
    return (
	    <div className="App">
	    <header className="App-header">
	    </header>
            <body>
	    <h1>Hello World!</h1>
	    <iframe title="heartrate" id="myIframe" name="myIframe"  allowusermedia width="1200" height="800" src="https://heartrateleaderboard.netlify.app/" allow="camera; microphone;"></iframe>
	    Result: <br />
	    <textarea id='result'></textarea>
	    </body>

	</div>
    );
}

export default App;
