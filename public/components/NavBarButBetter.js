import { html, define, render } from 'https://unpkg.com/hybrids@^6';

const parseCookie = str =>
    str
    .split(';')
    .map(v => v.split('='))
    .reduce((acc, v) => {
        acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
        return acc;
    }, {});

define({
  tag: "nav-bar-but-better",
  render: render(function(host) {
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
                    ${console.log(parseCookie(document.cookie))}
                    ${document.cookie.indexOf("name") != -1 ? 
                    html`
                        <account-info name=${parseCookie(document.cookie).name}></account-info>
                    `: html`
                        <a href="/login" class="nav-item btn btn-primary mr-2">Log In</a>
                    `}
                </span>
            </div>
        </nav>
    `
  }, {shadowRoot: false})
});