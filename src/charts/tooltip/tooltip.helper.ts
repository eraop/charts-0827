import { COMPONENT_PREFIX, Theme } from '../../core';
import { DomElement, findDomElement } from '../../helpers';
import { TooltipPositions } from './tooltip.style';
import { PositionDirection, TooltipOptions } from './tooltip.types';

export const TOOLTIP_ID = `${COMPONENT_PREFIX}-tooltip`;
export const TOOLTIP_CLASS = TOOLTIP_ID;
export const defaultTooltipOptions: TooltipOptions = {
  fontSize: '13px',
  borderRadius: '4px',
  padding: '0.5rem 0.75rem',
  showTotal: false,
  appendToBody: false,
  zIndex: 888,
};

export function getTooltipElement(parentElement: HTMLElement, options?: TooltipOptions): DomElement {
  let tooltipEl: DomElement | null;
  if (options?.appendToBody) {
    tooltipEl = findDomElement(`#${TOOLTIP_ID}`);
  } else {
    tooltipEl = findDomElement(`.${TOOLTIP_ID}`, parentElement);
  }

  // Create element on first render
  if (!tooltipEl) {
    tooltipEl = new DomElement('div')
      .addClass(`${TOOLTIP_CLASS}`)
      .setStyle('opacity', 0)
      .setStyle('pointer-events', 'none')
      .setStyle('position', 'absolute')
      .setStyle('transition', 'all .1s ease');
    if (options?.appendToBody) {
      tooltipEl.setAttribute('id', TOOLTIP_ID).appendToBody();
    } else {
      // below will append the tooltip element to container, but it may be cut by container.
      tooltipEl.appendTo(parentElement);
    }
    if (options?.maxWidth) {
      tooltipEl.setStyle('max-width', options.maxWidth);
    }
    if (options?.minWidth) {
      tooltipEl.setStyle('min-width', options.minWidth);
    }
  }

  const tooltipArrow = new DomElement('div')
    .addClass(`${TOOLTIP_CLASS}-arrow`)
    .setStyle('position', 'absolute')
    .setStyle('border-style', 'solid')
    .setStyle('border-color', 'transparent')
    .setStyle('border-width', '6px');
  tooltipEl.addChild(tooltipArrow);
  return tooltipEl;
}

export function getTooltipContainer(options: TooltipOptions, theme: Theme): DomElement {
  return new DomElement('div')
    .addClass(`${TOOLTIP_CLASS}-container`)
    .setStyle('border-radius', options.borderRadius)
    .setStyle('padding', options.padding)
    .setStyle('font-size', options.fontSize)
    .setStyle('background-color', theme?.tooltipBackgroundColor)
    .setStyle('color', theme?.tooltipTextColor);
}

export function getTooltipArrow(): DomElement {
  return new DomElement('div')
    .addClass(`${TOOLTIP_CLASS}-arrow`)
    .setStyle('position', 'absolute')
    .setStyle('border-style', 'solid')
    .setStyle('border-color', 'transparent')
    .setStyle('border-width', '6px');
}
export function getTooltipFooter(options: TooltipOptions, chart: any): DomElement {
  const footerEl = new DomElement('div').addClass(`${TOOLTIP_CLASS}-footer`).setStyle('text-align', 'center');
  let footers: string[] = [];
  if (typeof options.footer === 'string') {
    footers = [options.footer];
  } else if (Array.isArray(options.footer)) {
    footers = options.footer;
  } else if (typeof options.footer === 'function') {
    const footerFnResult = options.footer(chart);
    if (typeof footerFnResult === 'string') {
      footers = [footerFnResult];
    } else if (Array.isArray(footerFnResult)) {
      footers = footerFnResult;
    }
  }

  footers.forEach((text: string) => {
    footerEl.newChild('div').setHtml(text);
  });
  return footerEl;
}

export function setPositionDirection(alignKey: PositionDirection, tooltipEl: DomElement, theme: Theme): void {
  const arrowEl = findDomElement(`.${TOOLTIP_CLASS}-arrow`, tooltipEl.nativeElement);
  const currentPosition = TooltipPositions[alignKey];
  // Remove caret position
  Object.values(PositionDirection).forEach((direction) => {
    tooltipEl.removeClass(direction);
  });
  if (currentPosition) {
    // Set caret position
    tooltipEl.addClass(alignKey);
    if (arrowEl && currentPosition.arrow) {
      Object.entries(TooltipPositions[alignKey].arrow as { [key: string]: string }).forEach(([key, value]) => {
        if (key === 'borderDirection') {
          arrowEl.setStyle('border-' + value + '-color', theme?.tooltipBackgroundColor);
        } else {
          arrowEl.setStyle(key, value);
        }
      });
    }
    tooltipEl.setStyle('transform', currentPosition.transform);
  } else {
    tooltipEl.addClass('no-transform');
  }
}

export function resetTooltipByParent(parentElement: HTMLElement, options?: TooltipOptions): void {
  let tooltipEl: DomElement | null;
  if (options?.appendToBody) {
    tooltipEl = findDomElement(`#${TOOLTIP_ID}`);
  } else {
    tooltipEl = findDomElement(`.${TOOLTIP_ID}`, parentElement);
  }
  resetTooltip(tooltipEl);
}

export function resetTooltip(tooltipEl: DomElement | null): void {
  if (!tooltipEl) {
    return;
  }
  tooltipEl.clearChildren();
  Object.values(PositionDirection).forEach((direction) => {
    tooltipEl.removeClass(direction);
  });
  tooltipEl.setStyle('opacity', 0);
}
