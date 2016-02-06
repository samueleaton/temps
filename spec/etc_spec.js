const jsdom = require('jsdom');
window = jsdom.jsdom('<html><head></head><body></body></html>').defaultView;
document = window.document;
const etc = require('../etc.js');


describe("Div Creator", function() {
  it("should create a div", function() {
  	const div = document.createElement('div');
  	div.setAttribute("class", "superdiv");
    expect(div.classList.contains("superdiv")).toBe(true);
    expect(div instanceof window.HTMLElement).toBe(true);
  });
});
