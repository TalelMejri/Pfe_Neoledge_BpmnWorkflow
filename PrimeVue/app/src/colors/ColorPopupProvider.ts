const COLORS = [
  {
    label: 'Default',
    fill: undefined,
    stroke: undefined,
  },
  {
    label: 'Blue',
    fill: '#BBDEFB',
    stroke: '#0D4372',
  },
  {
    label: 'Orange',
    fill: '#FFE0B2',
    stroke: '#6B3C00',
  },
  {
    label: 'Green',
    fill: '#C8E6C9',
    stroke: '#205022',
  },
  {
    label: 'Red',
    fill: '#FFCDD2',
    stroke: '#831311',
  },
  {
    label: 'Purple',
    fill: '#E1BEE7',
    stroke: '#5B176D',
  },
  {
    label: 'Yellow',
    fill: '#bfff00',
    stroke: '#5B176D',
  },
];

const COLOR_POPUP_PROVIDER_INJECT: string[] = [
  'config.colorPicker',
  'config.bpmnRenderer',
  'popupMenu',
  'modeling',
  'translate'
];

export default class ColorPopupProvider {
  _popupMenu: any;
  _modeling: any;
  _translate: any;
  _colors: any[];
  _defaultFillColor: string;
  _defaultStrokeColor: string;

  constructor(config: any, bpmnRendererConfig: any, popupMenu: any, modeling: any, translate: any) {
    this._popupMenu = popupMenu;
    this._modeling = modeling;
    this._translate = translate;

    this._colors = (config && config.colors) || COLORS;
    this._defaultFillColor = (bpmnRendererConfig && bpmnRendererConfig.defaultFillColor) || 'white';
    this._defaultStrokeColor = (bpmnRendererConfig && bpmnRendererConfig.defaultStrokeColor) || 'rgb(34, 36, 42)';

    this._popupMenu.registerProvider('color-picker', this);
  }

  getEntries(elements: any[]) {
    const self = this;

    const colorIconHtml = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" height="100%" width="100%">
        <rect rx="2" x="1" y="1" width="22" height="22" fill="var(--fill-color)" stroke="var(--stroke-color)" style="stroke-width:2"></rect>
      </svg>
    `;

    const entries = this._colors.map(function (color) {
      const entryColorIconHtml = colorIconHtml
        .replace('var(--fill-color)', color.fill || self._defaultFillColor)
        .replace('var(--stroke-color)', color.stroke || self._defaultStrokeColor);

      return {
        title: self._translate(color.label),
        id: color.label.toLowerCase() + '-color',
        action: self.createAction(self._modeling, elements, color),
      };
    });
    return entries;
  }

  createAction(modeling: any, element: any, color: any) {
    const self = this;
    return function () {
      modeling.setColor(element, color);
    };
  }
}

(ColorPopupProvider as any).$inject = COLOR_POPUP_PROVIDER_INJECT;
