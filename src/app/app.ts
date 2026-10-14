import { AfterViewInit, Component, computed, ElementRef, HostListener, inject, OnDestroy, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { gsap } from 'gsap';
import Lenis from 'lenis';
import { DAYS, EVENT_SOURCE, getEventState, OFFICIAL_SITE, ORGANIZERS, SPONSORS } from './event-data';
import { checkAnswer, MISSIONS, scoreFor } from './cyber-lab';
import { SignalOrbit } from './signal-orbit';

@Component({
  selector: 'app-root',
  imports: [SignalOrbit],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements AfterViewInit, OnDestroy {
  private readonly root: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly document = inject(DOCUMENT);
  protected readonly officialSite = OFFICIAL_SITE;
  protected readonly eventSource = EVENT_SOURCE;
  protected readonly days = DAYS;
  protected readonly organizers = ORGANIZERS;
  protected readonly sponsors = SPONSORS;
  protected readonly missions = MISSIONS;
  protected readonly menuOpen = signal(false);
  protected readonly activeSection = signal('inicio');
  protected readonly activeDay = signal(0);
  protected readonly day = computed(() => DAYS[this.activeDay()]);
  protected readonly activeCommunityTab = signal<'organizers' | 'sponsors'>('organizers');
  protected readonly currentMission = signal(0);
  protected readonly mission = computed(() => MISSIONS[this.currentMission()]);
  protected readonly solved = signal<string[]>([]);
  protected readonly score = computed(() => scoreFor(this.solved()));
  protected readonly allSolved = computed(() => this.solved().length === MISSIONS.length);
  protected readonly answer = signal('');
  protected readonly feedback = signal('');
  protected readonly feedbackKind = signal<'success' | 'error' | 'hint'>('hint');
  protected readonly command = signal('');
  protected readonly commandOutput = signal('Escribí help para explorar.');
  protected readonly motionEnabled = signal(true);
  protected readonly reducedMotion = signal(false);
  protected readonly effectsEnabled = computed(() => this.motionEnabled() && !this.reducedMotion());
  protected readonly now = signal(Date.now());
  protected readonly eventState = computed(() => getEventState(this.now()));
  protected readonly countdown = computed(() => {
    const remaining = Math.max(0, Date.parse('2026-10-14T00:00:00-03:00') - this.now());
    return [Math.floor(remaining / 86400000), Math.floor(remaining / 3600000) % 24, Math.floor(remaining / 60000) % 60];
  });
  private lenis?: Lenis;
  private animation?: gsap.Context;
  private observer?: IntersectionObserver;
  private navigationObserver?: IntersectionObserver;
  private media?: MediaQueryList;
  private interval?: ReturnType<typeof setInterval>;
  private readonly onMotionChange = (event: MediaQueryListEvent) => {
    this.reducedMotion.set(event.matches);
    this.configureMotion();
  };

  ngAfterViewInit(): void {
    this.media = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.reducedMotion.set(this.media.matches);
    this.media.addEventListener('change', this.onMotionChange);
    this.configureMotion();
    this.interval = setInterval(() => this.now.set(Date.now()), 30000);
    if ('IntersectionObserver' in window) {
      this.navigationObserver = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) this.activeSection.set(entry.target.id);
        }
      }, { rootMargin: '-15% 0px -65% 0px' });
      this.root.nativeElement.querySelectorAll('main > section[id]').forEach(section => this.navigationObserver?.observe(section));
    }
  }

  ngOnDestroy(): void {
    this.lenis?.destroy();
    this.animation?.revert();
    this.observer?.disconnect();
    this.navigationObserver?.disconnect();
    this.media?.removeEventListener('change', this.onMotionChange);
    if (this.interval) clearInterval(this.interval);
  }

  private configureMotion(): void {
    this.lenis?.destroy();
    this.animation?.revert();
    this.observer?.disconnect();
    const elements = this.root.nativeElement.querySelectorAll<HTMLElement>('[data-reveal]');
    elements.forEach(element => element.classList.remove('reveal-pending'));
    if (!this.effectsEnabled()) return;
    this.lenis = new Lenis({ autoRaf: true, smoothWheel: true, syncTouch: false, duration: 1.05, anchors: { offset: -100 } });
    this.animation = gsap.context(() => {
      gsap.from('.hero-word', { y: 55, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', clearProps: 'all' });
      gsap.from('.hero-art', { opacity: 0, scale: 0.94, duration: 1.2, ease: 'power2.out', clearProps: 'all' });
    }, this.root.nativeElement);
    this.initScrollReveal(elements);
  }

  private initScrollReveal(elements: NodeListOf<HTMLElement>): void {
    if (!('IntersectionObserver' in window)) return;

    this.observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target as HTMLElement;
        element.dataset['revealed'] = 'true';
        element.classList.remove('reveal-pending');
        this.observer?.unobserve(element);
      }
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

    const groupPositions = new Map<Element, number>();
    elements.forEach(element => {
      if (element.dataset['revealed'] === 'true') return;
      // Keep content already passed during a hash jump or motion toggle visible.
      if (element.getBoundingClientRect().bottom <= 0) {
        element.dataset['revealed'] = 'true';
        return;
      }
      const parent = element.parentElement;
      const position = parent ? (groupPositions.get(parent) ?? 0) : 0;
      if (parent) groupPositions.set(parent, position + 1);
      element.style.setProperty('--reveal-delay', `${Math.min(position, 4) * 80}ms`);
      element.classList.add('reveal-pending');
      this.observer?.observe(element);
    });
  }

  @HostListener('focusin', ['$event'])
  protected revealFocusedElement(event: FocusEvent): void {
    if (!(event.target instanceof Element)) return;
    const element = event.target.closest<HTMLElement>('[data-reveal]');
    if (!element) return;
    element.dataset['revealed'] = 'true';
    element.classList.remove('reveal-pending');
    this.observer?.unobserve(element);
  }

  protected toggleMotion(): void {
    this.motionEnabled.update(enabled => !enabled);
    this.configureMotion();
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  protected escapeMenu(): void {
    if (!this.menuOpen()) return;
    this.closeMenu();
    this.root.nativeElement.querySelector<HTMLButtonElement>('.menu-toggle')?.focus();
  }

  protected selectDay(index: number): void {
    this.activeDay.set(index);
  }

  protected switchDay(event: KeyboardEvent): void {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const index = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1 - this.activeDay();
    this.selectDay(index);
    this.root.nativeElement.querySelector<HTMLButtonElement>(`#day-tab-${index}`)?.focus();
  }

  protected switchCommunityTab(event: KeyboardEvent): void {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const tab = event.key === 'Home' ? 'organizers' : event.key === 'End' ? 'sponsors'
      : this.activeCommunityTab() === 'organizers' ? 'sponsors' : 'organizers';
    this.activeCommunityTab.set(tab);
    this.root.nativeElement.querySelector<HTMLButtonElement>(`#community-tab-${tab}`)?.focus();
  }

  protected selectMission(index: number): void {
    this.currentMission.set(index);
    this.answer.set('');
    this.feedback.set('');
  }

  protected submitAnswer(value = this.answer()): void {
    const mission = this.mission();
    if (!value.trim()) {
      this.feedbackKind.set('error');
      this.feedback.set('Ingresá una respuesta para verificarla.');
      return;
    }
    if (checkAnswer(mission, value)) {
      if (!this.solved().includes(mission.id)) this.solved.update(items => [...items, mission.id]);
      this.feedbackKind.set('success');
      this.feedback.set(mission.solution);
    } else {
      this.feedbackKind.set('error');
      this.feedback.set('Todavía no. Revisá la evidencia o pedí una pista; podés volver a intentar.');
    }
  }

  protected showHint(): void {
    this.feedbackKind.set('hint');
    this.feedback.set(this.mission().hint);
  }

  protected nextMission(): void {
    const next = MISSIONS.findIndex((item, index) => index > this.currentMission() && !this.solved().includes(item.id));
    const firstUnsolved = MISSIONS.findIndex(item => !this.solved().includes(item.id));
    this.selectMission(next >= 0 ? next : Math.max(0, firstUnsolved));
  }

  protected resetLab(): void {
    this.solved.set([]);
    this.selectMission(0);
    this.command.set('');
    this.commandOutput.set('Nueva sesión. Escribí help para explorar.');
  }

  protected runCommand(): void {
    const input = this.command().trim();
    const [name, ...args] = input.split(/\s+/);
    const argument = args.join(' ');
    switch (name.toLowerCase()) {
      case 'help': this.commandOutput.set('misiones · abrir 1/2/3 · pista · verificar <respuesta> · score · clear'); break;
      case 'misiones':
        this.commandOutput.set(MISSIONS.map(item => `${item.number} ${item.title}${this.solved().includes(item.id) ? ' [RESUELTO]' : ''}`).join('\n'));
        break;
      case 'abrir': {
        const index = Number(argument) - 1;
        if (Number.isInteger(index) && index >= 0 && index < MISSIONS.length) {
          this.selectMission(index);
          this.commandOutput.set(`Misión ${index + 1} abierta.`);
        } else this.commandOutput.set('Elegí una misión: abrir 1, abrir 2 o abrir 3.');
        break;
      }
      case 'pista': this.showHint(); this.commandOutput.set(this.mission().hint); break;
      case 'verificar': this.submitAnswer(argument); this.commandOutput.set(this.feedback()); break;
      case 'score': this.commandOutput.set(`${this.score()} / 450 puntos · ${this.solved().length} / 3 misiones`); break;
      case 'clear': this.commandOutput.set(''); break;
      default: this.commandOutput.set(input ? `Comando desconocido: ${name}. Escribí help.` : 'Escribí help para ver los comandos.');
    }
    this.command.set('');
  }

  protected scrollToLab(): void {
    const element = this.document.getElementById('cyber-lab');
    if (this.lenis && this.effectsEnabled() && element) this.lenis.scrollTo(element, { offset: -90 });
    else element?.scrollIntoView({ behavior: 'auto' });
  }
}
