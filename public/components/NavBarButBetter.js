import { html, define, render } from 'https://unpkg.com/hybrids@^6';

define({
  tag: "nav-bar-but-better",
  render: render(function(host){
    return html`
        <nav id="p-nav" class="header-top topnav fixed-top navbar navbar-expand-lg navbar-dark bg-dark">
            <a class="navbar-brand brand" id="brand" href="/">Touch of Class Events</a>
            <button class="navbar-toggler float-right" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="/reserve">Reserve a Table</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/attractions">Buy Tickets</a>
                    </li>
                </ul>
                <span id="account" class="float-right">
                    <a href="/login" class="nav-item btn btn-primary mr-2">Log In</a>
                </span>
            </div>
        </nav>
    `
  }, {shadowRoot: false})
});