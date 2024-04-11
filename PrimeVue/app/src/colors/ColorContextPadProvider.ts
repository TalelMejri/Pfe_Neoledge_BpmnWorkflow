const colorImageSvg =
  `
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor">
         <path d="m12.5 5.5.3-.4 3.6-3.6c.5-.5 1.3-.5 1.7 0l1 1c.5.4.5 1.2 0 1.7l-3.6 3.6-.4.2v.2c0 1.4.6 2 1 2.7v.6l-1.7 1.6c-.2.2-.4.2-.6 0L7.3 6.6a.4.4 0 0 1 0-.6l.3-.3.5-.5.8-.8c.2-.2.4-.1.6 0 .9.5 1.5 1.1 3 1.1zm-9.9 6 4.2-4.2 6.3 6.3-4.2 4.2c-.3.3-.9.3-1.2 0l-.8-.8-.9-.8-2.3-2.9" />
    </svg>
  `;

const COLOR_POPUP_PROVIDER_INJECT: string[] = [
  'contextPad',
  'popupMenu',
  'canvas',
  'translate'
];

class ColorContextPadProvider {
  _contextPad: any;
  _popupMenu: any;
  _canvas: any;
  _translate: any;

  constructor(contextPad: any, popupMenu: any, canvas: any, translate: any) {
    this._contextPad = contextPad;
    this._popupMenu = popupMenu;
    this._canvas = canvas;
    this._translate = translate;

    contextPad.registerProvider(this);
  }

  getContextPadEntries(element: any) {
    return this._createPopupAction([element]);
  }

  getMultiElementContextPadEntries(elements: any[]) {
    return this._createPopupAction(elements);
  }

  _createPopupAction(elements: any[]) {
    const canvas = this._canvas;
    const translate = this._translate;
    const contextPad = this._contextPad;
    const popupMenu = this._popupMenu;

    return {
      'set-color': {
        group: 'edit',
        className: 'bpmn-icon-color',
        title: translate('Set color'),
        html: `<div class="entry">${colorImageSvg}</div>`,
        action: {
          click: (event: any, element: any) => {
            var position = {
              ...this.getStartPosition(canvas, contextPad, elements),
              cursor: {
                x: event.x,
                y: event.y
              }
            };
            popupMenu.open(elements, 'color-picker', position);
            try {
              const container = document.querySelector('.djs-popup-body');
              const titledDivs = container?.querySelectorAll('div[title]');
              titledDivs?.forEach((div: any) => {
                let color = div.getAttribute('title').toLowerCase();
                div.style.backgroundColor = color == 'default' ? 'white' : color;
                div.style.color = color == 'default' ? 'white' : color;
                div.style.cursor = "pointer";
              });
            } catch (e) {
              console.log(e);
            }
          }
        }
      }
    };
  }

  getStartPosition(canvas: any, contextPad: any, elements: any) {
    var Y_OFFSET = 5;

    var diagramContainer = canvas.getContainer(),
      pad = contextPad.getPad(elements).html;

    var diagramRect = diagramContainer.getBoundingClientRect(),
      padRect = pad.getBoundingClientRect();

    var top = padRect.top - diagramRect.top;
    var left = padRect.left - diagramRect.left;

    var pos = {
      x: left,
      y: top + padRect.height + Y_OFFSET
    };

    return pos;
  }
}
(ColorContextPadProvider as any).$inject = COLOR_POPUP_PROVIDER_INJECT;
export default ColorContextPadProvider;