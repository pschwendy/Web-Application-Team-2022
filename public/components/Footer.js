import { html, define, render } from 'https://unpkg.com/hybrids@^6';

define({
  tag: "p-footer",
  screenSize: 0,
  render: render(function(host, screenSize) {
    return html`
    <div style="color: white; padding-top:20px; background: rgb(33, 37, 41);" class="foot">
        <div class="py-2 container">
            <div class="row">
                <div class="col-md ml-2 mb-4"><img class="footer-logo pull-right img-fluid" src="public/images/logo-1.png"></img></div>
                
                <div class="foot-txt col-md mb-4">
                    <h6 class="font-weight-bold">Huron BPA Chapter</h6>
                    <div class="foot-txt mb-3">
                    This website was made by the 2022 BPA Web Application Team of the Huron BPA Chapter; the prompt, create an event planning website for Touch of Class Events. The Huron BPA Chapter recognizes the importance of sportsmanship within competitions and stresses the importance of community service. As a chapter, we pride ourselves in contributing to a passionate, diligent, and motivated community full of leaders and young scholars. 
                    </div>
                    <a target="_blank" href="https://www.huronbpa.com/" class=" btn btn-primary mr-2">Find out more</a>
                </div>
                <div class="col">
                    <address class="page-list">
                        <a className='foot-a' href='/'>Home</a><br>
                        <a className='foot-a' href='/attractions'>Attractions</a><br>
                        <a className='foot-a' href='/reserve'>Reserve Seats</a><br>
                        <a className='foot-a' href='/login'>Login</a><br>
                    </address>                
                </div>
            </div>
        </div>
        <hr>
        <div class="container-fluid text-center">
            <div class="pb-2">
                <div class="container">
                    <div class="row mb-3">
                        <div class="col-md mx-2">
                        Experiencing problems? Email us at huron.bpa@gmail.com
                        </div>
                    </div>
                </div>
                <div class="row pb-2 mt-2">
                    <div class="col">
                        <a style="color:inherit;" href="mailto:huron.bpa@gmail.com"><i class="fas fa-paper-plane fa-2x"></i></a>
                    </div>
                    <div class="col">
                        <a style="color:inherit;" target="_blank" href="https://github.com/YnotCode/Web-Application-Team-2022"><i class="fas fa-code fa-2x"></i></a>
                    </div>
                    <div class="col">
                        <a style="color:inherit;" target="_blank" href="https://twitter.com/National_BPA"><i class="fab fa-twitter fa-2x"></i></a>
                    </div>
                    <div class="col">
                        <a style="color:inherit;" target="_blank" href="https://facebook.com/businessprofessionalsofamerica"><i class="fab fa-facebook fa-2x"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
  }, {shadowRoot: false})
});
