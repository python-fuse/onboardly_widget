import { TourStep } from "../types";
import { calculateTooltipPosition } from "../utils/dom";

export class ToolTip {
  private container: HTMLDivElement | null = null;
  private arrow: HTMLDivElement | null = null;
  private onNext?: () => void;
  private onPrev?: () => void;
  private onSkip?: () => void;
  private isMobile = window.innerWidth < 768;

  show(
    step: TourStep,
    targetElement: Element,
    currentIndex: number,
    totalSteps: number,
    handlers: {
      onNext?: () => void;
      onPrev?: () => void;
      onSkip?: () => void;
    }
  ) {
    this.hide();
    this.onNext = handlers.onNext;
    this.onPrev = handlers.onPrev;
    this.onSkip = handlers.onSkip;
    this.isMobile = window.innerWidth < 768;

    this.createContainer(step, currentIndex, totalSteps);
    this.positionTooltip(targetElement, step.placement);
    
    if (!this.isMobile) {
      this.createModernArrow(targetElement, step.placement || 'top');
    }

    this.attachEventListeners(currentIndex === 0);
    this.animateIn();
  }

  private createContainer(step: TourStep, currentIndex: number, totalSteps: number): void {
    this.container = document.createElement("div");
    this.container.className = "tour-tooltip";
    
    const isFirstStep = currentIndex === 0;
    const isLastStep = currentIndex === totalSteps - 1;
    const progressPercentage = ((currentIndex + 1) / totalSteps) * 100;

    // Apply base styles using Object.assign to avoid CSS conflicts
    const baseStyles: any = {
      position: 'fixed',
      zIndex: '10000',
      background: 'rgba(89, 13, 242, 0.15)',
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      borderRadius: '16px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      boxSizing: 'border-box',
      color: '#FFFFFF',
      opacity: '0',
      transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
    };

    if (this.isMobile) {
      // Mobile styles
      Object.assign(this.container.style, baseStyles, {
        padding: '20px',
        maxWidth: 'calc(100vw - 40px)',
        width: 'calc(100vw - 40px)',
        margin: '0 20px',
        left: '50%',
        transform: 'translateX(-50%) scale(0.95) translateY(10px)'
      });
      this.container.innerHTML = this.getMobileHTML(step, currentIndex, totalSteps, isFirstStep, isLastStep, progressPercentage);
    } else {
      // Desktop styles
      Object.assign(this.container.style, baseStyles, {
        padding: '24px',
        maxWidth: '400px',
        minWidth: '320px',
        transform: 'scale(0.95) translateY(10px)'
      });
      this.container.innerHTML = this.getDesktopHTML(step, currentIndex, totalSteps, isFirstStep, isLastStep, progressPercentage);
    }

    document.body.appendChild(this.container);
  }

  private getMobileHTML(step: TourStep, currentIndex: number, totalSteps: number, 
                       isFirstStep: boolean, isLastStep: boolean, progressPercentage: number): string {
    const buttonStyle = this.getButtonStyle;
    
    return `
      <div style="margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 12px;">
          <h3 style="margin: 0; font-size: 17px; font-weight: 600; color: #FFFFFF; line-height: 1.3; flex: 1;">
            ${step.title}
          </h3>
          <button class="tour-btn-close" style="${buttonStyle('close', true)}" aria-label="Close tour">
            ×
          </button>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 16px;">
          <div style="font-size: 14px; color: rgba(255, 255, 255, 0.8); white-space: nowrap;">
            Step ${currentIndex + 1} of ${totalSteps}
          </div>
          <div style="flex: 1; height: 6px; background: rgba(255, 255, 255, 0.1); border-radius: 3px; overflow: hidden; box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);">
            <div style="width: ${progressPercentage}%; height: 100%; background: linear-gradient(90deg, #590df2, #8a2be2); border-radius: 3px;"></div>
          </div>
        </div>
        
        <div style="margin: 16px 0; line-height: 1.6; color: rgba(255, 255, 255, 0.9); font-size: 15px;">
          ${step.content}
        </div>
      </div>
      
      <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 20px;">
        <button class="tour-btn-skip" style="${buttonStyle('skip', true)}">
          ${isLastStep ? 'Close' : 'Skip Tour'}
        </button>
        
        <div style="display: flex; gap: 12px;">
          <button class="tour-btn-prev" style="${buttonStyle('back', true)}" ${isFirstStep ? 'disabled' : ''}>
            Back
          </button>
          
          <button class="tour-btn-next" style="${buttonStyle('next', true)}">
            ${isLastStep ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    `;
  }

  private getDesktopHTML(step: TourStep, currentIndex: number, totalSteps: number,
                        isFirstStep: boolean, isLastStep: boolean, progressPercentage: number): string {
    const buttonStyle = this.getButtonStyle;
    
    return `
      <div style="margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 8px;">
          <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #FFFFFF; line-height: 1.3; flex: 1;">
            ${step.title}
          </h3>
          <button class="tour-btn-close" style="${buttonStyle('close')}" aria-label="Close tour">
            ×
          </button>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px;">
          <div style="font-size: 14px; color: rgba(255, 255, 255, 0.8); white-space: nowrap;">
            Step ${currentIndex + 1} of ${totalSteps}
          </div>
          <div style="flex: 1; height: 6px; background: rgba(255, 255, 255, 0.1); border-radius: 3px; overflow: hidden; box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);">
            <div style="width: ${progressPercentage}%; height: 100%; background: linear-gradient(90deg, #590df2, #8a2be2); border-radius: 3px;"></div>
          </div>
        </div>
      </div>
      
      <div style="margin: 20px 0; line-height: 1.6; color: rgba(255, 255, 255, 0.9); font-size: 15px;">
        ${step.content}
      </div>
      
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px; gap: 12px;">
        <button class="tour-btn-skip" style="${buttonStyle('skip')}">
          ${isLastStep ? 'Close' : 'Skip Tour'}
        </button>
        
        <div style="display: flex; gap: 12px;">
          <button class="tour-btn-prev" style="${buttonStyle('back')}" ${isFirstStep ? 'disabled' : ''}>
            Back
          </button>
          
          <button class="tour-btn-next" style="${buttonStyle('next')}">
            ${isLastStep ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    `;
  }

  private getButtonStyle(type: 'next' | 'back' | 'skip' | 'close', mobile = false): string {
    const base = mobile ? 'padding: 14px 16px; font-size: 15px;' : 'padding: 10px 20px; font-size: 14px;';
    const borderRadius = mobile ? '12px' : '10px';
    
    const styles = {
      next: `${base} border: none; border-radius: ${borderRadius}; background: linear-gradient(135deg, #590df2, #8a2be2); color: white; font-weight: 600; box-shadow: 0 4px 20px rgba(89, 13, 242, 0.4);`,
      back: `${base} border: none; border-radius: ${borderRadius}; background: rgba(89, 13, 242, 0.33); color: #FFFFFF;`,
      skip: `${base} border: 1px solid rgba(255, 255, 255, 0.15); border-radius: ${borderRadius}; background: rgba(255, 255, 255, 0.08); color: rgba(255, 255, 255, 0.9);`,
      close: `padding: ${mobile ? '6px' : '4px'}; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; background: rgba(255, 255, 255, 0.1); color: #FFFFFF; font-size: ${mobile ? '20px' : '18px'}; width: ${mobile ? '36px' : '32px'}; height: ${mobile ? '36px' : '32px'}; display: flex; align-items: center; justify-content: center;`
    };
    
    return styles[type] + ' cursor: pointer; transition: all 0.2s ease;';
  }

  private positionTooltip(targetElement: Element, placement?: string): void {
    if (!this.container) return;
    
    const targetBounds = targetElement.getBoundingClientRect();
    const toolTipRect = this.container.getBoundingClientRect();
    
    let pos;
    if (this.isMobile) {
      // Center on mobile, positioned above target or below if no space
      const aboveTarget = targetBounds.top - toolTipRect.height - 20;
      const belowTarget = targetBounds.bottom + 20;
      
      if (aboveTarget > 20) {
        // Position above target
        pos = {
          top: aboveTarget,
          left: window.innerWidth / 2
        };
      } else {
        // Position below target
        pos = {
          top: Math.min(belowTarget, window.innerHeight - toolTipRect.height - 20),
          left: window.innerWidth / 2
        };
      }
    } else {
      pos = calculateTooltipPosition(
        targetBounds,
        toolTipRect.width,
        toolTipRect.height,
        placement || 'top'
      );
    }

    this.container.style.top = `${pos.top}px`;
    if (!this.isMobile) {
      this.container.style.left = `${pos.left}px`;
    }
  }

  private createModernArrow(targetElement: Element, placement: string): void {
    this.arrow = document.createElement('div');
    const arrowSize = 20;
    const targetBounds = targetElement.getBoundingClientRect();
    const tooltipBounds = this.container!.getBoundingClientRect();
    
    let arrowStyles = `
      position: fixed;
      width: ${arrowSize}px;
      height: ${arrowSize}px;
      background: rgba(89, 13, 242, 0.15);
      backdrop-filter: blur(12px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.18);
      z-index: 9999;
      pointer-events: none;
      opacity: 0;
      transform: scale(0);
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    `;
    
    switch (placement) {
      case 'top':
        arrowStyles += `top: ${tooltipBounds.bottom - arrowSize/2}px; left: ${targetBounds.left + targetBounds.width / 2}px; transform: translateX(-50%) rotate(45deg) scale(0); border-right: none; border-bottom: none;`;
        break;
      case 'bottom':
        arrowStyles += `top: ${tooltipBounds.top - arrowSize/2}px; left: ${targetBounds.left + targetBounds.width / 2}px; transform: translateX(-50%) rotate(45deg) scale(0); border-left: none; border-top: none;`;
        break;
      case 'left':
        arrowStyles += `top: ${targetBounds.top + targetBounds.height / 2}px; left: ${tooltipBounds.right - arrowSize/2}px; transform: translateY(-50%) rotate(45deg) scale(0); border-right: none; border-top: none;`;
        break;
      case 'right':
        arrowStyles += `top: ${targetBounds.top + targetBounds.height / 2}px; left: ${tooltipBounds.left - arrowSize/2}px; transform: translateY(-50%) rotate(45deg) scale(0); border-left: none; border-bottom: none;`;
        break;
    }
    
    this.arrow.style.cssText = arrowStyles;
    document.body.appendChild(this.arrow);
  }

  private attachEventListeners(isFirstStep: boolean): void {
    if (!this.container) return;

    const addClick = (selector: string, handler: () => void, condition = true) => {
      if (!condition) return;
      
      const element = this.container!.querySelector(selector);
      if (element) {
        element.addEventListener('click', () => {
          this.hide();
          handler();
        });
      }
    };

    addClick('.tour-btn-next', () => this.onNext?.());
    addClick('.tour-btn-prev', () => this.onPrev?.(), !isFirstStep);
    addClick('.tour-btn-skip', () => this.onSkip?.());
    addClick('.tour-btn-close', () => this.onSkip?.());

    if (!this.isMobile) {
      this.addHoverEffects();
    }
  }

  private addHoverEffects(): void {
    if (!this.container) return;
