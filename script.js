const SIZE = 1080;

const canvas = document.querySelector("#photoCanvas");
const ctx = canvas.getContext("2d");
const canvasWrap = document.querySelector("#canvasWrap");
const emptyPreview = document.querySelector("#emptyPreview");
const dragHelp = document.querySelector("#dragHelp");
const fileInput = document.querySelector("#fileInput");
const uploadButton = document.querySelector("#uploadButton");
const uploadText = document.querySelector("#uploadText");
const adjustments = document.querySelector("#adjustments");
const resetButton = document.querySelector("#resetButton");
const zoomRange = document.querySelector("#zoomRange");
const zoomOutput = document.querySelector("#zoomOutput");
const downloadButton = document.querySelector("#downloadButton");

const overlay = new Image();
let photo = null;
let photoUrl = null;
let overlayReady = false;
let zoom = 1;
let position = { x: 0, y: 0 };
let dragStart = null;

overlay.addEventListener("load", () => {
  overlayReady = true;
  draw();
});
overlay.src = "assets/frame.png";

function draw() {
  ctx.clearRect(0, 0, SIZE, SIZE);
  if (!photo) return;

  ctx.fillStyle = "#e8f2fc";
  ctx.fillRect(0, 0, SIZE, SIZE);

  const baseScale = Math.max(SIZE / photo.naturalWidth, SIZE / photo.naturalHeight);
  const scale = baseScale * zoom;
  const width = photo.naturalWidth * scale;
  const height = photo.naturalHeight * scale;
  const x = (SIZE - width) / 2 + position.x;
  const y = (SIZE - height) / 2 + position.y;
  ctx.drawImage(photo, x, y, width, height);

  if (overlayReady) ctx.drawImage(overlay, 0, 0, SIZE, SIZE);
}

function chooseFile() {
  fileInput.click();
}

function setEditorEnabled(enabled) {
  emptyPreview.hidden = enabled;
  dragHelp.hidden = !enabled;
  canvasWrap.classList.toggle("has-image", enabled);
  adjustments.classList.toggle("disabled", !enabled);
  zoomRange.disabled = !enabled;
  resetButton.disabled = !enabled;
  downloadButton.disabled = !enabled;
  uploadText.textContent = enabled ? "Trocar foto" : "Selecionar foto";
}

function resetPhoto() {
  zoom = 1;
  position = { x: 0, y: 0 };
  zoomRange.value = "1";
  zoomOutput.textContent = "100%";
  draw();
}

fileInput.addEventListener("change", (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file || !file.type.startsWith("image/")) return;

  if (photoUrl) URL.revokeObjectURL(photoUrl);
  photoUrl = URL.createObjectURL(file);
  const nextPhoto = new Image();
  nextPhoto.addEventListener("load", () => {
    photo = nextPhoto;
    resetPhoto();
    setEditorEnabled(true);
  });
  nextPhoto.src = photoUrl;
  event.target.value = "";
});

uploadButton.addEventListener("click", chooseFile);
emptyPreview.addEventListener("click", chooseFile);
resetButton.addEventListener("click", resetPhoto);

zoomRange.addEventListener("input", (event) => {
  zoom = Number(event.target.value);
  zoomOutput.textContent = `${Math.round(zoom * 100)}%`;
  draw();
});

canvas.addEventListener("pointerdown", (event) => {
  if (!photo) return;
  canvas.setPointerCapture(event.pointerId);
  dragStart = {
    pointer: { x: event.clientX, y: event.clientY },
    origin: { ...position },
  };
  canvas.classList.add("dragging");
});

canvas.addEventListener("pointermove", (event) => {
  if (!dragStart) return;
  const ratio = SIZE / canvas.getBoundingClientRect().width;
  position = {
    x: dragStart.origin.x + (event.clientX - dragStart.pointer.x) * ratio,
    y: dragStart.origin.y + (event.clientY - dragStart.pointer.y) * ratio,
  };
  draw();
});

function stopDragging(event) {
  if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  dragStart = null;
  canvas.classList.remove("dragging");
}

canvas.addEventListener("pointerup", stopDragging);
canvas.addEventListener("pointercancel", stopDragging);

downloadButton.addEventListener("click", () => {
  if (!photo) return;
  const link = document.createElement("a");
  link.download = "foto-euclydes-1015.png";
  link.href = canvas.toDataURL("image/png", 1);
  link.click();
});

setEditorEnabled(false);
