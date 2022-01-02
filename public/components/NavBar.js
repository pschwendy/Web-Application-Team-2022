import { html, define, render } from 'https://unpkg.com/hybrids@^6';

define({
  tag: "nav-bar",
  render: render(function(host){
    return html`
    <nav style="margin-bottom: 10vh !important;" class="fixed-top navbar navbar-expand-lg navbar-dark bg-dark">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
        </button>
        <div style="width: 20%;" class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item">
                <a class="nav-link" href="#">Reserve a Table</a>
                </li>
                <li class="nav-item">
                <a class="nav-link" href="/attractions">Buy Tickets</a>
                </li>
            </ul>
        </div>
        <div class="container-fluid" style="width: 60%; margin: auto; display: flex; justify-content: center;">
            <a style="text-align: center;" class="navbar-brand" href="/">Touch of Class Events</a>
        </div>
        <div class="collapse navbar-collapse" style="width: 20%; display: flex; justify-content: center;">
            <ul class="navbar-nav">
                <li class="nav-item">
                <a class="nav-link" href="#"><button class="btn btn-primary">Log In</button></a>
                </li>
            </ul>
        </div>
    </nav>
    <div style="height: 10vh";></div>
`
  }, {shadowRoot: false})
});