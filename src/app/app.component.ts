import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';

@Component({
  selector: 'app-root',
  imports: [PdfViewerComponent],
  template: `
    <app-pdf-viewer></app-pdf-viewer>
`,
  styleUrl: './app.component.css',

})
export class AppComponent {
  title = 'angular-pdf-viewer';
}
