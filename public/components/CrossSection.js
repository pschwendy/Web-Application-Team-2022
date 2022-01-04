import { html, define, render } from 'https://unpkg.com/hybrids@^6';

define({
  tag: "cross-section",
  title: "",
  description: "",
  link: "",
  img: "",
  width: "",
  render: render(function(host, title, description, link, img, alt) {
    return html`
    <div class="">
        <div class="cross-section">
            <div class="cross-info" width=${host.width}>
                <div>hi</div>
                <div></div>
                <button></button>
            </div>
            <div class="cross-image">
                hi
                <img>
            </div>
        </div>
    </div>
    `
  }, {shadowRoot: false})
});