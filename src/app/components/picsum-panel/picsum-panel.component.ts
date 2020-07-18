import { Component, OnInit } from '@angular/core';
import { PicsumService } from 'src/app/services/picsum.service';

@Component({
  selector: 'app-picsum-panel',
  templateUrl: './picsum-panel.component.html',
  styleUrls: ['./picsum-panel.component.scss'],
})
export class PicsumPanelComponent implements OnInit {
  images;
  columns;
  numberOfColumns = 3;
  columnItems = {};
  currentPage = 1;
  limit = 40;

  constructor(private picsumService: PicsumService) {}

  ngOnInit(): void {
    this.picsumService.getAll(this.currentPage, this.limit).subscribe(
      (data) => {
        this.images = data || [];
        this.columns = new Array(this.numberOfColumns).fill(1).map((x, i) => i);
        this.setUpMasonryLayout();
      },
      (err) => {
        this.images = [];
        this.columns = [];
      }
    );
  }

  setUpMasonryLayout() {
    for (let i = 0; i < this.images.length; i++) {
      const columnIndex = i % this.numberOfColumns;
      if (!this.columnItems[columnIndex]) {
        this.columnItems[columnIndex] = [];
      }
      this.columnItems[columnIndex].push(this.images[i]);
    }
  }

  getNextPageImages() {
    this.currentPage += 1;
    this.picsumService.getAll(this.currentPage, this.limit).subscribe(
      (data) => {
        this.images = this.images.concat(data);
        this.updateMasonryLayout();
      },
      (err) => {
        this.currentPage -= 1;
      }
    );
  }

  updateMasonryLayout() {
    for (
      let i = (this.currentPage - 1) * this.limit;
      i < this.images.length;
      i++
    ) {
      const columnIndex = i % this.numberOfColumns;
      if (!this.columnItems[columnIndex]) {
        this.columnItems[columnIndex] = [];
      }
      this.columnItems[columnIndex].push(this.images[i]);
    }
  }

  onImageDragStart(e, imgSrc) {
    e.dataTransfer.setData('imgSrc', imgSrc);
  }
}
