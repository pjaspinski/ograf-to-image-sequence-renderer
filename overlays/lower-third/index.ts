import Ograf from 'ograf';

// Declare global gsap for browser usage (loaded via script tag)
declare const gsap: typeof import('gsap').gsap;

interface LowerThirdData {
  name: string;
  title: string;
  colors: {
    main: string;
    mainText: string;
    accent: string;
    accentText: string;
  };
}

class LowerThird extends HTMLElement implements Ograf.GraphicsAPI.Graphic {
  private static readonly SKEW_ANGLE_DEGREES = 15;

  private mainRectangle: HTMLDivElement;
  private nameText: HTMLDivElement;
  private secondaryRectangle: HTMLDivElement;
  private titleText: HTMLDivElement;
  private data: LowerThirdData;
  private renderType: 'realtime' | 'non-realtime';
  private inTimeline: gsap.core.Timeline;
  private outTimeline: gsap.core.Timeline;
  private calculateSkewOffset(height: number): number {
    return Math.round(
      height * Math.tan((LowerThird.SKEW_ANGLE_DEGREES * Math.PI) / 180),
    );
  }

  async load(params) {
    console.log(params);
    this.data = params.data as LowerThirdData;
    this.renderType = params.renderType as 'realtime' | 'non-realtime';
    await this.loadGsap();
    await this.loadFonts();
    this.createMainRectangle();
    this.createNameText();
    this.createSecondaryRectangle();
    this.createTitleText();
    this.createInAnimationTimeline();
    this.createOutAnimationTimeline();
    return { statusCode: 0 };
  }

  async loadGsap() {
    return new Promise<void>((resolve, reject) => {
      const gsapScript = document.createElement('script');
      gsapScript.src =
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js';
      gsapScript.onload = () => resolve();
      gsapScript.onerror = () => reject(new Error('Failed to load GSAP'));
      document.head.appendChild(gsapScript);
    });
  }

  async loadFonts() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap';
    document.head.appendChild(link);

    await document.fonts.ready;
  }

  createMainRectangle() {
    this.mainRectangle = document.createElement('div');
    this.mainRectangle.id = 'main-rectangle';

    const height = 150;
    const skewOffset = this.calculateSkewOffset(height);

    Object.assign(this.mainRectangle.style, {
      position: 'absolute',
      bottom: '100px',
      width: '800px',
      transform: 'translateX(-100%)',
      height: `${height}px`,
      backgroundColor: this.data.colors.main,
      color: this.data.colors.mainText,
      clipPath: `polygon(0% 0%, 100% 0%, calc(100% - ${skewOffset}px) 100%, 0% 100%)`,
    });
    this.appendChild(this.mainRectangle);
  }

  createNameText() {
    this.nameText = document.createElement('div');
    this.nameText.id = 'name-text';
    Object.assign(this.nameText.style, {
      position: 'absolute',
      fontSize: '64px',
      fontFamily: 'Montserrat',
      fontWeight: '700',
      top: '10px',
      left: '30px',
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
    });
    this.nameText.innerHTML = this.data.name.toUpperCase();
    this.mainRectangle.appendChild(this.nameText);
  }

  createSecondaryRectangle() {
    this.secondaryRectangle = document.createElement('div');
    this.secondaryRectangle.id = 'secondary-rectangle';

    const height = 60;
    const skewOffset = this.calculateSkewOffset(height);

    Object.assign(this.secondaryRectangle.style, {
      position: 'absolute',
      bottom: '70px',
      width: '700px',
      transform: 'translateX(-100%)',
      height: `${height}px`,
      backgroundColor: this.data.colors.accent,
      color: this.data.colors.accentText,
      clipPath: `polygon(0% 0%, 100% 0%, calc(100% - ${skewOffset}px) 100%, 0% 100%)`,
    });
    this.appendChild(this.secondaryRectangle);
  }

  createTitleText() {
    this.titleText = document.createElement('div');
    this.titleText.id = 'title-text';
    Object.assign(this.titleText.style, {
      position: 'absolute',
      fontSize: '36px',
      fontFamily: 'Montserrat',
      fontWeight: '400',
      left: '30px',
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
    });
    this.titleText.innerHTML = this.data.title.toUpperCase();
    this.secondaryRectangle.appendChild(this.titleText);
  }

  createInAnimationTimeline() {
    const timeline = gsap.timeline();

    if (this.renderType === 'non-realtime') {
      timeline.pause();
    }

    timeline.to(this.mainRectangle, {
      transform: 'translateX(0)',
      duration: 1,
      ease: 'power1.out',
    });
    timeline.to(
      this.nameText,
      {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0%     100%)',
        duration: 1,
        ease: 'power1.out',
      },
      0.25,
    );
    timeline.to(
      this.secondaryRectangle,
      {
        transform: 'translateX(0)',
        duration: 1,
        ease: 'power1.out',
      },
      0.4,
    );
    timeline.to(
      this.titleText,
      {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        duration: 1,
        ease: 'power1.out',
      },
      0.65,
    );

    this.inTimeline = timeline;
  }

  createOutAnimationTimeline() {
    const timeline = gsap.timeline();
    timeline.pause();
    timeline.to(this.titleText, {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
      duration: 1,
      ease: 'power1.in',
    });
    timeline.to(
      this.secondaryRectangle,
      {
        transform: 'translateX(-100%)',
        duration: 1,
        ease: 'power1.in',
      },
      0.25,
    );
    timeline.to(
      this.nameText,
      {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
        duration: 1,
        ease: 'power1.in',
      },
      0.4,
    );
    timeline.to(
      this.mainRectangle,
      {
        transform: 'translateX(-100%)',
        duration: 1,
        ease: 'power1.in',
      },
      0.65,
    );

    this.outTimeline = timeline;
  }

  async dispose() {
    return { statusCode: 0 };
  }
  async updateAction() {
    console.error('Data update not supported.');
    return { statusCode: 1 };
  }
  async playAction() {
    this.inTimeline.play();
    return { statusCode: 0, currentStep: 0 };
  }
  async stopAction() {
    this.outTimeline.play();
    return { statusCode: 0 };
  }
  async customAction() {
    console.error('Custom actions not supported.');
    return { statusCode: 1 };
  }
  async goToTime(params) {
    console.log(params);
    return { statusCode: 0 };
  }
  async setActionsSchedule(params) {
    console.log(params);
    return { statusCode: 0 };
  }
}

export default LowerThird;
