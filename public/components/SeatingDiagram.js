import { html, define, render } from 'https://unpkg.com/hybrids@^6';

define({
  tag: "seating-diagram",
  render: render(function(host){
    return html`
    <div id="diagramHolder"></div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/5.1.3/pixi.min.js"></script>
    <script src="/public/SeatingRenderer.js"></script>
`
  }, {shadowRoot: false})
});

