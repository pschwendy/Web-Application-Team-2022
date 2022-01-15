import { html, define, render } from 'https://unpkg.com/hybrids@^6';

define({
  tag: "account-info",
  name: "",
  render: render(function(host, name){
    return html`
        <div id="user" class="dropdown">
            <button class="btn btn-danger dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                ${host.name}
            </button>
            <div id="user-menu" class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <a class="dropdown-item" href="/itinerary">Itinerary</a>
                <a onclick="removeG()" onload="changeForms()" id="pain" class="dropdown-item" href="./logout">Log Out</a>
            </div>
        </div>
    `
  }, {shadowRoot: false})
});