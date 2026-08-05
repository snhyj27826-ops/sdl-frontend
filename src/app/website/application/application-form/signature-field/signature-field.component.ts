import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  forwardRef,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';

export interface Signature {
  type: 'image' | 'drawn';
  dataUrl: string;
}

@Component({
  selector: 'app-signature-field',
  templateUrl: './signature-field.component.html',
  styleUrls: ['./signature-field.component.scss'],
  standalone: true,
  imports: [MatIcon, MatButton, MatIconButton],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SignatureFieldComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SignatureFieldComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignatureFieldComponent implements ControlValueAccessor, Validator, AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  public mode: 'draw' | 'upload' = 'draw';
  public signature: Signature | null = null;
  public isDisabled = false;
  public isDragOver = false;
  public hasDrawnStrokes = false;

  private isDrawing = false;
  private ctx: CanvasRenderingContext2D | null = null;
  private readonly CANVAS_WIDTH = 800;
  private readonly CANVAS_HEIGHT = 200;

  private onChange: (value: Signature | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    if (this.mode === 'draw') {
      this.initCanvas();
    }
  }

  ngOnDestroy(): void {}

  // ControlValueAccessor

  writeValue(value: Signature | null): void {
    this.signature = value;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: Signature | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this.cdr.markForCheck();
  }

  // Validator

  validate(_control: AbstractControl): ValidationErrors | null {
    return this.signature ? null : { required: true };
  }

  // Mode

  setMode(mode: 'draw' | 'upload'): void {
    if (this.mode === mode) return;
    this.mode = mode;
    this.clearSignature();
    if (mode === 'draw') {
      setTimeout(() => this.initCanvas(), 0);
    }
    this.cdr.markForCheck();
  }

  // Upload

  triggerFileInput(): void {
    this.fileInputRef.nativeElement.click();
  }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.readFile(file);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(): void {
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    const file = event.dataTransfer?.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      this.readFile(file);
    }
  }

  clearUpload(): void {
    if (this.fileInputRef) this.fileInputRef.nativeElement.value = '';
    this.clearSignature();
  }

  private readFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.signature = { type: 'image', dataUrl: e.target?.result as string };
      this.onChange(this.signature);
      this.onTouched();
      this.cdr.markForCheck();
    };
    reader.readAsDataURL(file);
  }

  // Canvas drawing

  private initCanvas(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    this.ctx = canvas.getContext('2d');
    if (this.ctx) {
      this.ctx.strokeStyle = '#1a2b4a';
      this.ctx.lineWidth = 2.5;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
    }
  }

  onPointerDown(event: PointerEvent): void {
    if (this.isDisabled) return;
    event.preventDefault();
    const canvas = this.canvasRef.nativeElement;
    canvas.setPointerCapture(event.pointerId);
    if (!this.ctx) this.initCanvas();
    this.isDrawing = true;
    const { x, y } = this.getCanvasCoords(event);
    this.ctx!.beginPath();
    this.ctx!.moveTo(x, y);
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.isDrawing || !this.ctx) return;
    event.preventDefault();
    const { x, y } = this.getCanvasCoords(event);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.hasDrawnStrokes = true;
  }

  onPointerUp(event: PointerEvent): void {
    if (!this.isDrawing) return;
    event.preventDefault();
    this.isDrawing = false;
    if (this.hasDrawnStrokes) {
      const dataUrl = this.canvasRef.nativeElement.toDataURL('image/png');
      this.signature = { type: 'drawn', dataUrl };
      this.onChange(this.signature);
      this.onTouched();
      this.cdr.markForCheck();
    }
  }

  clearCanvas(): void {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
    }
    this.hasDrawnStrokes = false;
    this.clearSignature();
  }

  private clearSignature(): void {
    this.signature = null;
    this.onChange(null);
    this.onTouched();
    this.cdr.markForCheck();
  }

  private getCanvasCoords(event: PointerEvent): { x: number; y: number } {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) * this.CANVAS_WIDTH) / rect.width,
      y: ((event.clientY - rect.top) * this.CANVAS_HEIGHT) / rect.height,
    };
  }
}
