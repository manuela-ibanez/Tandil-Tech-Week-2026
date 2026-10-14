import { AfterViewInit, Component, ElementRef, inject, Input, NgZone, OnChanges, OnDestroy, ViewChild } from '@angular/core';

interface OrbitLine {
  points: Float32Array;
  projected: Float32Array;
  depth: number;
  meridian: boolean;
}

@Component({
  selector: 'app-signal-orbit',
  template: `
    <img src="signal-orbit.svg" alt="" width="620" height="620">
    <canvas #canvas aria-hidden="true"></canvas>
  `,
  styles: `
    :host { display: block; position: absolute; inset: -5%; pointer-events: none; }
    img, canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
    img { filter: drop-shadow(0 0 24px #bfe95b1a); }
    canvas { opacity: 0; pointer-events: auto; touch-action: pan-y; cursor: grab; }
    canvas:active { cursor: grabbing; }
    :host(.is-ready) canvas { opacity: 1; }
    :host(.is-ready) img { visibility: hidden; }
    :host(.motion-paused) canvas { cursor: default; pointer-events: none; }
  `,
})
export class SignalOrbit implements AfterViewInit, OnChanges, OnDestroy {
  @Input() animated = true;
  @ViewChild('canvas', { static: true }) private canvas!: ElementRef<HTMLCanvasElement>;
  private readonly zone = inject(NgZone);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly lines: OrbitLine[] = [];
  private particleLines: OrbitLine[] = [];
  private context?: CanvasRenderingContext2D;
  private hero?: HTMLElement;
  private resizeObserver?: ResizeObserver;
  private visibilityObserver?: IntersectionObserver;
  private frame = 0;
  private lastFrame = 0;
  private visible = true;
  private size = 0;
  private time = 0;
  private pointer = { x: 0, y: 0 };
  private smoothPointer = { x: 0, y: 0 };
  private scroll = 0;
  private smoothScroll = 0;
  private drag?: { id: number; x: number; y: number };
  private rotation = { x: 0, y: 0 };
  private smoothRotation = { x: 0, y: 0 };

  ngAfterViewInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d', { alpha: true }) ?? undefined;
    if (!this.context) return;
    this.host.nativeElement.classList.add('is-ready');
    this.hero = this.host.nativeElement.closest<HTMLElement>('.hero') ?? undefined;
    this.createMesh();
    this.zone.runOutsideAngular(() => {
      this.resize();
      this.updateScroll();
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(this.host.nativeElement);
      if ('IntersectionObserver' in window) {
        this.visibilityObserver = new IntersectionObserver(entries => {
          this.visible = entries[0].isIntersecting;
          this.syncAnimation();
        });
        this.visibilityObserver.observe(this.host.nativeElement);
      }
      this.hero?.addEventListener('pointermove', this.onPointerMove, { passive: true });
      this.hero?.addEventListener('pointerleave', this.onPointerLeave);
      this.canvas.nativeElement.addEventListener('pointerdown', this.onPointerDown);
      this.canvas.nativeElement.addEventListener('pointerup', this.onPointerUp);
      this.canvas.nativeElement.addEventListener('pointercancel', this.onPointerUp);
      this.canvas.nativeElement.addEventListener('lostpointercapture', this.onPointerUp);
      window.addEventListener('scroll', this.updateScroll, { passive: true });
      document.addEventListener('visibilitychange', this.onVisibilityChange);
      this.syncAnimation();
    });
  }

  ngOnChanges(): void {
    this.zone.runOutsideAngular(() => this.syncAnimation());
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.frame);
    this.resizeObserver?.disconnect();
    this.visibilityObserver?.disconnect();
    this.hero?.removeEventListener('pointermove', this.onPointerMove);
    this.hero?.removeEventListener('pointerleave', this.onPointerLeave);
    this.canvas.nativeElement.removeEventListener('pointerdown', this.onPointerDown);
    this.canvas.nativeElement.removeEventListener('pointerup', this.onPointerUp);
    this.canvas.nativeElement.removeEventListener('pointercancel', this.onPointerUp);
    this.canvas.nativeElement.removeEventListener('lostpointercapture', this.onPointerUp);
    window.removeEventListener('scroll', this.updateScroll);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
  }

  private createMesh(): void {
    const addLine = (fixed: number, meridian: boolean, segments: number) => {
      const points = new Float32Array((segments + 1) * 3);
      for (let index = 0; index <= segments; index++) {
        const angle = index / segments * Math.PI * 2;
        const u = meridian ? angle : fixed;
        const v = meridian ? fixed : angle;
        // A slightly twisted tube gives the wireframe an organic silhouette.
        const tube = v + Math.sin(u * 3) * 0.22;
        const radius = 1.48 + 0.57 * Math.cos(tube);
        points.set([radius * Math.cos(u), radius * Math.sin(u), 0.57 * Math.sin(tube)], index * 3);
      }
      this.lines.push({ points, projected: new Float32Array(points.length), depth: 0, meridian });
    };
    for (let index = 0; index < 56; index++) addLine(index / 56 * Math.PI * 2, false, 64);
    for (let index = 0; index < 16; index++) addLine(index / 16 * Math.PI * 2, true, 112);
    this.particleLines = [this.lines[8], this.lines[27], this.lines[45]];
  }

  private readonly onPointerMove = (event: PointerEvent): void => {
    if (!this.animated || !this.hero) return;
    if (this.drag?.id === event.pointerId) {
      this.rotation.y += (event.clientX - this.drag.x) / Math.max(this.size, 1) * 4;
      this.rotation.x -= (event.clientY - this.drag.y) / Math.max(this.size, 1) * 3;
      this.drag.x = event.clientX;
      this.drag.y = event.clientY;
    }
    if (event.pointerType !== 'mouse') return;
    const rect = this.hero.getBoundingClientRect();
    this.pointer.x = (event.clientX - rect.left) / rect.width * 2 - 1;
    this.pointer.y = (event.clientY - rect.top) / rect.height * 2 - 1;
  };

  private readonly onPointerLeave = (): void => {
    this.pointer = { x: 0, y: 0 };
  };

  private readonly onPointerDown = (event: PointerEvent): void => {
    if (!this.animated || !event.isPrimary || event.button !== 0) return;
    this.drag = { id: event.pointerId, x: event.clientX, y: event.clientY };
    this.canvas.nativeElement.setPointerCapture(event.pointerId);
  };

  private readonly onPointerUp = (event: PointerEvent): void => {
    if (this.drag?.id !== event.pointerId) return;
    this.drag = undefined;
    if (this.canvas.nativeElement.hasPointerCapture(event.pointerId)) {
      this.canvas.nativeElement.releasePointerCapture(event.pointerId);
    }
    this.onPointerLeave();
  };

  private readonly updateScroll = (): void => {
    if (!this.hero) return;
    const rect = this.hero.getBoundingClientRect();
    this.scroll = Math.min(1, Math.max(0, -rect.top / rect.height));
  };

  private readonly onVisibilityChange = (): void => this.syncAnimation();

  private syncAnimation(): void {
    if (!this.context) return;
    cancelAnimationFrame(this.frame);
    this.frame = 0;
    this.lastFrame = 0;
    this.host.nativeElement.classList.toggle('motion-paused', !this.animated);
    if (!this.animated) {
      if (this.drag && this.canvas.nativeElement.hasPointerCapture(this.drag.id)) {
        this.canvas.nativeElement.releasePointerCapture(this.drag.id);
      }
      this.drag = undefined;
      this.onPointerLeave();
    }
    if (this.animated && this.visible && !document.hidden) {
      this.frame = requestAnimationFrame(this.animate);
    }
  }

  private resize(): void {
    const rect = this.host.nativeElement.getBoundingClientRect();
    this.size = Math.min(rect.width, rect.height);
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.nativeElement.width = Math.round(rect.width * ratio);
    this.canvas.nativeElement.height = Math.round(rect.height * ratio);
    this.context?.setTransform(ratio, 0, 0, ratio, 0, 0);
    this.draw();
  }

  private readonly animate = (timestamp: number): void => {
    const delta = this.lastFrame ? Math.min((timestamp - this.lastFrame) / 1000, 0.05) : 0;
    this.lastFrame = timestamp;
    this.time += delta;
    const ease = 1 - Math.exp(-delta * 5);
    this.smoothPointer.x += (this.pointer.x - this.smoothPointer.x) * ease;
    this.smoothPointer.y += (this.pointer.y - this.smoothPointer.y) * ease;
    this.smoothScroll += (this.scroll - this.smoothScroll) * ease;
    this.smoothRotation.x += (this.rotation.x - this.smoothRotation.x) * ease;
    this.smoothRotation.y += (this.rotation.y - this.smoothRotation.y) * ease;
    this.draw();
    this.frame = requestAnimationFrame(this.animate);
  };

  private draw(): void {
    const ctx = this.context;
    if (!ctx || !this.size) return;
    const size = this.size;
    ctx.clearRect(0, 0, size, size);
    const t = this.time;
    const rx = 0.72 + Math.sin(t * 0.28) * 0.18 + this.smoothPointer.y * 0.35 + this.smoothScroll * 1.1 + this.smoothRotation.x;
    const ry = -0.32 + t * 0.18 + this.smoothPointer.x * 0.55 + this.smoothRotation.y;
    const rz = -0.35 + Math.sin(t * 0.18) * 0.14 - this.smoothScroll * 0.6;
    const cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry), cz = Math.cos(rz), sz = Math.sin(rz);
    const scale = size * 0.185 * (1 - this.smoothScroll * 0.12);
    const centerX = size * 0.5 + this.smoothPointer.x * size * 0.02;
    const centerY = size * (0.47 - this.smoothScroll * 0.055) + Math.sin(t * 0.8) * size * 0.012 + this.smoothPointer.y * size * 0.015;

    const halo = ctx.createRadialGradient(centerX, centerY, size * 0.08, centerX, centerY, size * 0.46);
    halo.addColorStop(0, 'rgba(197, 243, 106, 0)');
    halo.addColorStop(0.58, 'rgba(197, 243, 106, 0.045)');
    halo.addColorStop(1, 'rgba(197, 243, 106, 0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, size, size);

    for (const line of this.lines) {
      let depth = 0;
      for (let index = 0; index < line.points.length; index += 3) {
        const x = line.points[index], y = line.points[index + 1], z = line.points[index + 2];
        const y1 = y * cx - z * sx, z1 = y * sx + z * cx;
        const x2 = x * cy + z1 * sy, z2 = -x * sy + z1 * cy;
        const perspective = 5.8 / (5.8 - z2);
        line.projected[index] = centerX + (x2 * cz - y1 * sz) * scale * perspective;
        line.projected[index + 1] = centerY + (x2 * sz + y1 * cz) * scale * perspective;
        line.projected[index + 2] = z2;
        depth += z2;
      }
      line.depth = depth / (line.points.length / 3);
    }
    this.lines.sort((a, b) => a.depth - b.depth);

    ctx.lineWidth = Math.max(0.65, size / 740);
    ctx.strokeStyle = '#c5f36a';
    for (const line of this.lines) {
      // Draw back and front segments separately so depth stays visible as it turns.
      for (let layer = 0; layer < 2; layer++) {
        ctx.globalAlpha = layer === 0 ? 0.12 : line.meridian ? 0.42 : 0.72;
        ctx.beginPath();
        for (let index = 3; index < line.projected.length; index += 3) {
          const front = (line.projected[index + 2] + line.projected[index - 1]) > 0;
          if (front !== (layer === 1)) continue;
          ctx.moveTo(line.projected[index - 3], line.projected[index - 2]);
          ctx.lineTo(line.projected[index], line.projected[index + 1]);
        }
        ctx.stroke();
      }
    }

    ctx.globalAlpha = 1;
    ctx.fillStyle = '#e1ffb4';
    ctx.shadowColor = '#c5f36a';
    ctx.shadowBlur = 10;
    for (let index = 0; index < 3; index++) {
      const line = this.particleLines[index];
      const progress = (t * 0.06 + index * 0.31) % 1 * (line.projected.length / 3 - 1);
      const point = Math.floor(progress) * 3;
      const blend = progress % 1;
      const x = line.projected[point] + (line.projected[point + 3] - line.projected[point]) * blend;
      const y = line.projected[point + 1] + (line.projected[point + 4] - line.projected[point + 1]) * blend;
      ctx.globalAlpha = line.projected[point + 2] > 0 ? 0.95 : 0.25;
      ctx.beginPath();
      ctx.arc(x, y, Math.max(1.5, size / 220), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }
}
