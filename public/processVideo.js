function ProcessVideo() {
    let video = document.getElementById('videoInput');
    let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let dst = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let gray = new cv.Mat();
    let cap = new cv.VideoCapture(video);
    let faces = new cv.RectVector();
    let face_cascade = new cv.CascadeClassifier();
    let eyes = new cv.RectVector();
    let eye_cascade = new cv.CascadeClassifier();
    let intensities = [];
    let s = new cv.Scalar(0,0,0,255);
    
    // load pre-trained classifiers
    face_cascade.load('haarcascade_frontalface_default.xml');
    eye_cascade.load('haarcascade_eye.xml');

    let msize = new cv.Size(0, 0);
    const FPS = 15;
    let frame = 0;
    let last_detected_frame=0;
    
    function processVideo() {
	try {
            if (!streaming) {
		// clean and stop.
		src.delete();
		dst.delete();
		gray.delete();
		faces.delete();
		face_cascade.delete();
		eyes.delete();
		eye_cascade.delete();
		return;
            }
            let begin = Date.now();
            // start processing.
            cap.read(src);
            cv.flip(src, dst,1);

	    if ((last_detected_frame==0) || (frame - last_detected_frame>FPS) ) {
		cv.cvtColor(dst, gray, cv.COLOR_RGBA2GRAY, 0);
		face_cascade.detectMultiScale(gray, faces, 1.1, 3, 0, msize, msize);
		if (faces.size()>0) {
		    last_detected_frame = frame;
		}

	    }
	    for (let i=0; i<faces.size(); ++i) {
		face = faces.get(0);
		let roi_dst = dst.roi(face);
		let point1 = new cv.Point(face.x, face.y);
		let point2 = new cv.Point(face.x + face.width, face.y + face.height);
		cv.rectangle(dst, point1, point2, [255, 0, 0, 255]);

		/*
		let roi_gray = gray.roi(face);
		eye_cascade.detectMultiScale(roi_gray, eyes);
		for (let j = 0; j < eyes.size(); ++j) {
		    let eye = eyes.get(j);
		    let point1 = new cv.Point(eye.x, eye.y);
		    let point2 = new cv.Point(eye.x + eye.width, eye.y + eye.height);
		    cv.rectangle(roi_dst, point1, point2, [0, 0, 255, 255]);
		    roi_dst.roi(eye).setTo(s); 		    //set eye to black
		}

		roi_gray.delete();
		*/
		
		//Calculate the intensities of the red channel of face ROI
		let intensity = cv.mean(roi_dst)[0]; //red

		intensities.push(intensity);

		roi_dst.delete();

            }
            cv.imshow('canvasOutput', dst);


	    pollctx();
            // schedule the next one.
            let delay = 1000/FPS - (Date.now() - begin);
	    //console.log('frame: ' + frame + ' ' + last_detected_frame + ' delay: ' + delay);
	    delay = (delay<0) ? 0 : delay;
            setTimeout(processVideo, delay);
	    frame += 1;

	} catch (err) {
            utils.printError(err);
	}
    };

    // schedule the first one.
    setTimeout(processVideo, 0);




    // copied from copy.js

    // FFT stuff
    var fftr1;
    var arrLen = 256;
    var maxInd, maxVal;

    var t0 = performance.now();

    // Getting frequency
    var times = [];
    var timesLen = arrLen/4;
    var curPollFreq;

    // Heartrate
    var heartrate;


    /* https://stackoverflow.com/questions/4225432/how-to-compute-frequency-of-data-using-fft

       Suppose x[n] = cos(2*pi*f0*n/fs) where f0 is the frequency of your sinusoid in Hertz, n=0:N-1, and fs is the sampling rate of x in samples per second.

       Let X = fft(x). Both x and X have length N. Suppose X has two peaks at n0 and N-n0.

       Then the sinusoid frequency is f0 = fs*n0/N Hertz.

       Example: fs = 8000 samples per second, N = 16000 samples. Therefore, x lasts two seconds long.
       
       Suppose X = fft(x) has peaks at 2000 and 14000 (=16000-2000). Therefore, f0 = 8000*2000/16000 = 1000 Hz.


     */
    async function pollctx(){

	if (intensities.length > arrLen){
            intensities.shift();

            // Calculate the FFT and update the chart
            calcFFT();
	}else{
            console.log(intensities.length)
	}


	// Get next animation

	times.push(performance.now()-t0);
	if (times.length > timesLen){
            times.shift();
            curPollFreq = 1/(times.reduce((a, b) => a + b, 0)/timesLen/1000);

            if (isNaN(heartrate)){
		heartrate = maxInd*curPollFreq/arrLen*30;
            }

            heartrate = heartrate + ( maxInd*curPollFreq/arrLen*30 - heartrate)*.01;
            heartrateIndicator = document.getElementById('heartrate')
	    // need to calibrate again, quick fix for now
            heartrateIndicator.textContent = "Predicted heartrate: " + Math.round(heartrate)*3 + " BPM"

	}
	t0 = performance.now();
//	requestAnimationFrame(pollctx);
    }

    async function calcFFT(){

	tmp = fftr1.forward(intensities);

	maxVal = 0;
	maxInd = 0;

	// Find peaks past the meyer wave and DC noise freqs
	tmp.forEach((item, index, arr) => {
            arr[index] = Math.abs(item)
            if (index > 8 && arr[index] > maxVal){
		maxInd = index
		maxVal = arr[index]
            }
	})
    }

    fftr1 = new window.kiss.FFTR(arrLen);
//    pollctx();

};
