// Individual Testimonials
// Tag uses description, user, img, and role to make column in towering testimonials
import { html, define, render } from 'https://unpkg.com/hybrids@^6';

define({
  tag: "single-testimonial",
  description: "", 
  user: "",
  render: render(function(host, description, user){
    return html`
        <div class="col-md mb-4 text-center">
            <div class="t-description">"${host.description}"</div>
            <div class="mt-3 t-user">${host.user}</h4>
        </div>
    `
  }, {shadowRoot: false})
});