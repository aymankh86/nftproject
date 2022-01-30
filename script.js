const model = new mi.ArbitraryStyleTransferNetwork();
const canvas = document.getElementById('stylized');
const canvas2 = document.getElementById('stylized2');
const ctx = canvas.getContext('2d');
const ctx2 = canvas2.getContext('2d');
const contentImg = document.getElementById('content');
const styleImg1 = document.getElementById('style1');
const styleImg2 = document.getElementById('style2');
const loading = document.getElementById('loading');
const notLoading = document.getElementById('ready');

setupDemo();

function setupDemo() {
  model.initialize().then(() => {
    // stylize();
  });
}

async function clearCanvas() {
  // Don't block painting until we've reset the state.
  await mi.tf.nextFrame();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
  await mi.tf.nextFrame();
}

async function stylize() {
startLoading();
  await clearCanvas();

  // Resize the canvas to be the same size as the source image.
  canvas.width = contentImg.width;
  canvas.height = contentImg.height;

  // This does all the work!
  model.stylize(styleImg1, styleImg2, 0.5).then((imageData) => {
		model.stylize(contentImg, imageData).then((imageData2) => {
			stopLoading();
    	ctx.putImageData(imageData2, 0, 0);
		})
  });
	// model.stylize(contentImg, styleImg1, 1).then((imageData2) => {
	// 	stopLoading();
	// 	ctx.putImageData(imageData2, 0, 0);
	// })
}

function loadImage(event, imgElement) {
  const reader = new FileReader();
  reader.onload = (e) => {
    imgElement.src = e.target.result;
    // startLoading();
    // stylize();
  };
  reader.readAsDataURL(event.target.files[0]);
}

function loadContent(event) {
  loadImage(event, contentImg);
}

function loadStyle1(event) {
  loadImage(event, styleImg1);
}

function loadStyle2(event) {
  loadImage(event, styleImg2);
}

function startLoading() {
  loading.hidden = false;
//   notLoading.hidden = true;
  canvas.style.opacity = 0;
}

function stopLoading() {
  loading.hidden = true;
//   notLoading.hidden = false;
  canvas.style.opacity = 1;
}
