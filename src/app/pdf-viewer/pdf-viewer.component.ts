// import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
// import * as pdfjsLib from 'pdfjs-dist';

// @Component({
//   selector: 'app-pdf-viewer',
//   templateUrl: './pdf-viewer.component.html',
//   styleUrls: ['./pdf-viewer.component.css'],
// })
// export class PdfViewerComponent implements OnInit, OnDestroy {
//   @ViewChild('pdfCanvas', { static: true }) pdfCanvas!: ElementRef<HTMLCanvasElement>;
//   private renderTask: any;

//   constructor() {}

//   ngOnInit(): void {
//     this.renderPdf();
//   }

//   ngOnDestroy(): void {
//     if (this.renderTask) {
//       this.renderTask.cancel();
//     }
//   }

//   async renderPdf() {
//     try {
//       const pdfjs = pdfjsLib as any;
//       pdfjs.GlobalWorkerOptions.workerSrc = 'assets/pdf.worker.min.mjs';

//       const loadingTask = pdfjs.getDocument('assets/sample.pdf');
//       const pdf = await loadingTask.promise;

//       const page = await pdf.getPage(1);
//       const viewport = page.getViewport({ scale: 1.5 });

//       const canvas = this.pdfCanvas.nativeElement;
//       const context = canvas.getContext('2d')!;
//       canvas.height = viewport.height;
//       canvas.width = viewport.width;

//       const renderContext = {
//         canvasContext: context,
//         viewport: viewport,
//       };

//       this.renderTask = page.render(renderContext);
//       await this.renderTask.promise;
//       console.log('PDF rendered successfully');
//     } catch (error) {
//       console.error('Error rendering PDF:', error);
//     }
//   }
// }

import {
	Component,
	OnInit,
	OnDestroy,
	ElementRef,
	ViewChild,
} from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';

@Component({
	selector: 'app-pdf-viewer',
	templateUrl: './pdf-viewer.component.html',
	styleUrls: ['./pdf-viewer.component.css'],
})
export class PdfViewerComponent implements OnInit, OnDestroy {
	@ViewChild('pdfContainer', { static: true })
	pdfContainer!: ElementRef<HTMLDivElement>;
	private pdfDocument: any;
	private currentPageNumber = 1;
	private scale = 1.5;
	totalPages = 0;
	currentPage = 1;

	constructor() {}

	ngOnInit(): void {
		this.loadPdf();
	}

	ngOnDestroy(): void {
		// Cleanup resources when the component is destroyed
	}

	// Load the PDF file
	async loadPdf() {
		try {
			const pdfjs = pdfjsLib as any;
			pdfjs.GlobalWorkerOptions.workerSrc =
				'assets/pdf.worker.min.mjs';

			const loadingTask = pdfjs.getDocument('assets/sample.pdf'); // Path to your PDF file
			this.pdfDocument = await loadingTask.promise;
			this.totalPages = this.pdfDocument.numPages;
			this.renderPage(this.currentPageNumber);
		} catch (error) {
			console.error('Error loading PDF:', error);
		}
	}

	// Render a specific page of the PDF
	async renderPage(pageNumber: number) {
		const page = await this.pdfDocument.getPage(pageNumber);
		const viewport = page.getViewport({ scale: this.scale });

		const container = this.pdfContainer.nativeElement;
		container.innerHTML = ''; // Clear previous content

		const canvas = document.createElement('canvas');
		container.appendChild(canvas);

		const context = canvas.getContext('2d')!;
		canvas.height = viewport.height;
		canvas.width = viewport.width;

		const renderContext = {
			canvasContext: context,
			viewport: viewport,
		};

		await page.render(renderContext).promise;
	}

	// Navigate to the previous page
	goToPrevPage() {
		if (this.currentPageNumber > 1) {
			this.currentPageNumber--;
			this.currentPage = this.currentPageNumber;
			this.renderPage(this.currentPageNumber);
		}
	}

	// Navigate to the next page
	goToNextPage() {
		if (this.currentPageNumber < this.totalPages) {
			this.currentPageNumber++;
			this.currentPage = this.currentPageNumber;
			this.renderPage(this.currentPageNumber);
		}
	}

	// Zoom in the PDF
	zoomIn() {
		this.scale += 0.25;
		this.renderPage(this.currentPageNumber);
	}

	// Zoom out the PDF
	zoomOut() {
		if (this.scale > 0.5) {
			this.scale -= 0.25;
			this.renderPage(this.currentPageNumber);
		}
	}
}
