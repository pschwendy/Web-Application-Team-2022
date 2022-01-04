import { html, define, render } from 'https://unpkg.com/hybrids@^6';

define({
  tag: "hero-image",
  tagline: "Title",
  description: "Default description",
  link: "/",
  img: "",
  alt: "Random image",
  render: render(function(host, tagline, description, link, img, alt){
    return html`
    <div class="head-hero">
        <div class="hero-holder">
            <img src=${host.img} class="hero" alt="Hero">
        </div>
        <div class='hero-text'>
              <h1 class="">${host.tagline}</h1>
        </div>
    </div>
    `
  }, {shadowRoot: false})
});