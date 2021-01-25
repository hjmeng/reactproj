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
    // load pre-trained classifiers
    face_cascade.load('haarcascade_frontalface_default.xml');
    eye_cascade.load('haarcascade_eye.xml');

    let msize = new cv.Size(0, 0);
    const FPS = 30;

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
            src.copyTo(dst);
            cv.cvtColor(dst, gray, cv.COLOR_RGBA2GRAY, 0);
            // detect faces.
            face_cascade.detectMultiScale(gray, faces, 1.1, 3, 0, msize, msize);


            for (let i = 0; i < faces.size(); ++i) {
		if (i>1) {break};		// draw one face
		let face = faces.get(i);
		let roi_gray = gray.roi(face);
		let roi_dst = dst.roi(face);
		let point1 = new cv.Point(face.x, face.y);
		let point2 = new cv.Point(face.x + face.width, face.y + face.height);
		cv.rectangle(dst, point1, point2, [255, 0, 0, 255]);

		eye_cascade.detectMultiScale(roi_gray, eyes);
		for (let j = 0; j < eyes.size(); ++j) {
		    let eye = eyes.get(j);
		    let point1 = new cv.Point(eye.x, eye.y);
		    let point2 = new cv.Point(eye.x + eye.width, eye.y + eye.height);
		    cv.rectangle(roi_dst, point1, point2, [0, 0, 255, 255]);
		}
		roi_gray.delete(); roi_dst.delete();
            }
            cv.imshow('canvasOutput', dst);


	    
            // schedule the next one.
            let delay = 1000/FPS - (Date.now() - begin);
            setTimeout(processVideo, delay);
	} catch (err) {
            utils.printError(err);
	}
    };

    // schedule the first one.
    setTimeout(processVideo, 0);
};
