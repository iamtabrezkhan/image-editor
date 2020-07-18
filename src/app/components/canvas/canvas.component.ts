import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { fabric } from 'fabric';

import { sizes, getSize } from '../../shared/size';
import { keys } from '../../shared/constants';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements OnInit, OnDestroy {
  @ViewChild('canvasEl', { static: true }) canvasEl: ElementRef;
  @ViewChild('canvasWrapper', { static: true }) canvasWrapper: ElementRef;
  @ViewChild('downloadBtn', { static: true }) downloadBtn: ElementRef;

  canvas: fabric.Canvas;
  canvasContainer: HTMLElement;
  sizes = sizes;
  selectedSize = '9x16';

  constructor() {}

  ngOnInit(): void {
    const size = getSize(this.selectedSize);
    this.initCanvas(size.w, size.h);
  }

  ngOnDestroy(): void {
    this.canvasContainer.removeEventListener(
      'drop',
      this.onDropImage.bind(this)
    );
    this.canvasContainer.removeEventListener('keyup', this.onKeyUp.bind(this));
  }

  initCanvas(width, height) {
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.borderScaleFactor = 1.5;
    this.canvas = new fabric.Canvas('my-canvas', {
      width: width,
      height: height,
      backgroundColor: '#ffffff',
    });
    this.canvasContainer = this.canvasWrapper.nativeElement.childNodes[0];
    this.canvasContainer.style.boxShadow = '0 2px 8px rgba(14,19,24,.07)';
    this.canvasContainer.addEventListener('drop', this.onDropImage.bind(this));
    this.canvasContainer.tabIndex = 1000;
    this.canvasContainer.addEventListener('keyup', this.onKeyUp.bind(this));
    this.canvasContainer.style.outline = 'none';
    this.resizeCanvas(width, height);
  }

  resizeCanvas(width, height): void {
    this.canvas.setDimensions(
      {
        width: '100%',
        height: '100%',
      },
      { cssOnly: true }
    );
    this.canvas.setDimensions(
      {
        width: width,
        height: height,
      },
      { backstoreOnly: true }
    );
    if (width > height) {
      this.canvasContainer.style.width = '100%';
      const clientWidth = this.canvasContainer.clientWidth;
      const heightPercent = this.percentOf(height, width);
      const h = this.fromPercent(heightPercent, clientWidth);
      this.canvasContainer.style.height = `${h}px`;
    } else {
      this.canvasContainer.style.height = '100%';
      const clientHeight = this.canvasContainer.clientHeight;
      const widthPercent = this.percentOf(width, height);
      const w = this.fromPercent(widthPercent, clientHeight);
      this.canvasContainer.style.width = `${w}px`;
    }
  }

  percentOf(x: number, y: number): number {
    return (x * 100) / y;
  }

  fromPercent(x: number, y: number): number {
    return (x * y) / 100;
  }

  hasBackgroundImage(): boolean {
    return !!this.canvas.backgroundImage;
  }

  onDropImage(e) {
    e.preventDefault();
    const imgSrc = e.dataTransfer.getData('imgSrc');
    const imgEl = new Image();
    imgEl.crossOrigin = 'anonymous';
    imgEl.onload = function (e) {
      this.addNewImage(imgEl);
      if (!this.hasBackgroundImage()) {
        // set background with blurred image
        this.setBackgroundImage(imgEl);
      }
    }.bind(this);
    imgEl.src = imgSrc;
  }

  onKeyUp(e) {
    const keyCode = e.keyCode || e.which;
    switch (keyCode) {
      case keys.DELETE: {
        this.onDelete(e);
        break;
      }
    }
  }

  getActiveObjects(): fabric.Object[] {
    return this.canvas.getActiveObjects();
  }

  deselectAllObjects() {
    this.canvas.discardActiveObject();
  }

  addNewImage(imgEl: HTMLImageElement) {
    const fabricImg = new fabric.Image(imgEl);
    this.centerObjectToCanvas(fabricImg);
    this.deselectAllObjects();
    fabricImg.bringToFront();
    this.canvas.add(fabricImg);
    this.canvas.renderAll();
  }

  addNewText(text) {
    const newText = new fabric.IText(text, {
      fontSize: 32,
    });
    this.canvas.add(newText);
    this.canvas.renderAll();
  }

  deleteObjects(obj: fabric.Object[]) {
    this.canvas.remove(...obj);
  }

  setBackgroundImage(imgEl: HTMLImageElement) {
    const f = fabric as any;
    const blurFilter = new f.Image.filters.Blur({
      blur: 0.3,
    });
    const bgImg = new fabric.Image(imgEl, {
      crossOrigin: 'anonymous',
    });
    if ((fabric as any).isWebglSupported()) {
      fabric.textureSize = Math.max(bgImg.width, bgImg.height);
    }
    bgImg.filters.push(blurFilter);
    bgImg.applyFilters();
    this.centerBackgroundImage(bgImg);
    this.canvas.setBackgroundImage(
      bgImg,
      this.canvas.requestRenderAll.bind(this.canvas)
    );
  }

  centerBackgroundImage(bgImg: fabric.Image) {
    const canvasAspectRatio = this.getCanvasAspectRatio();
    const imageAspectRatio = this.getObjectAspectRatio(bgImg);
    let scaleFactor, left, top;
    if (canvasAspectRatio >= imageAspectRatio) {
      scaleFactor = this.canvas.width / bgImg.width;
      left = 0;
      top = -(bgImg.height * scaleFactor - this.canvas.height) / 2;
    } else {
      scaleFactor = this.canvas.height / bgImg.height;
      top = 0;
      left = -(bgImg.width * scaleFactor - this.canvas.width) / 2;
    }
    bgImg.left = left;
    bgImg.top = top;
    bgImg.scaleX = scaleFactor;
    bgImg.scaleY = scaleFactor;
  }

  centerObjectToCanvas(obj: fabric.Object) {
    const objectAspectRatio = this.getObjectAspectRatio(obj);
    const canvasAspectRatio = this.getCanvasAspectRatio();
    if (objectAspectRatio < canvasAspectRatio) {
      obj.scaleToHeight(this.canvas.height);
      const renderableHeight = this.canvas.height;
      const renderableWidth = obj.width * (renderableHeight / obj.height);
      obj.left = (this.canvas.width - renderableWidth) / 2;
      obj.top = 0;
    } else if (objectAspectRatio > canvasAspectRatio) {
      obj.scaleToWidth(this.canvas.width);
      const renderableWidth = this.canvas.width;
      const renderableHeight = obj.height * (renderableWidth / obj.width);
      obj.left = 0;
      obj.top = (this.canvas.height - renderableHeight) / 2;
    } else {
      obj.scaleToWidth(this.canvas.width);
      obj.scaleToHeight(this.canvas.height);
    }
  }

  onTextClick(e) {
    this.addNewText('Your text here!');
  }

  onDelete(e) {
    const activeObjects = this.getActiveObjects();
    if (activeObjects.length <= 0) {
      return;
    }
    this.deleteObjects(activeObjects);
    this.deselectAllObjects();
  }

  onSizeSelect(e) {
    this.selectedSize = e.target.value;
    const size = getSize(this.selectedSize);
    this.resizeCanvas(size.w, size.h);
    this.canvas.renderAll();
  }

  onBringForward(e) {
    const activeObject = this.canvas.getActiveObject();
    activeObject.bringForward();
  }

  onPushBackward(e) {
    const activeObject = this.canvas.getActiveObject();
    activeObject.sendBackwards();
  }

  onDownload(e) {
    const image = this.canvas.toDataURL({
      format: 'jpeg',
      quality: 1,
    });
    this.downloadBtn.nativeElement.download = 'download.jpeg';
    this.downloadBtn.nativeElement.href = image;
    this.downloadBtn.nativeElement.click();
  }

  applyFilters(img: fabric.Image, filters) {
    img.filters = img.filters.concat(filters);
    img.applyFilters();
  }

  getObjectAspectRatio(obj: fabric.Object) {
    return obj.width / obj.height;
  }

  getCanvasAspectRatio() {
    return this.canvas.width / this.canvas.height;
  }

  onDragOver(e) {
    e.preventDefault();
  }
}
