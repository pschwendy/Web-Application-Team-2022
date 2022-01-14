import { html, define, render } from 'https://unpkg.com/hybrids@^6';

define({
  tag: "attraction-card",
  title: "Title",
  description: "Default description",
  link: "/",
  img: "/images/placeholder.png",
  alt: "Random image",
  render: render(function(host, title, description, link, img, alt){
    return html`
    <div class="card mx-4" style="margin-top: 20px;">
      <img src=${host.img} class="card-img-top" alt=${host.alt}>
      <div class="card-body">
        <h5 class="card-title">${host.title}</h5>
        <p class="card-text">
          ${host.description}
        </p>
        <a href=${host.link} class="btn btn-primary">Buy tickets</a>
      </div>
    </div>
`
  }, {shadowRoot: false})
});