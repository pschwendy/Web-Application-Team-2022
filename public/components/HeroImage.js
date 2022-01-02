import { html, define, render } from 'https://unpkg.com/hybrids@^6';

define({
  tag: "hero-image",
  title: "Title",
  description: "Default description",
  link: "/",
  img: "",
  alt: "Random image",
  render: render(function(host, title, description, link, img, alt){
    return html`
    <div class="head-hero">
        <img src=${host.img} class="hero" alt="Hero">
    </div>
`
  }, {shadowRoot: false})
});