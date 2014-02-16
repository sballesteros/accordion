var util = require("util");
var events = require("events");

function Accordion(container, opts){
  events.EventEmitter.call(this);

  opts = opts || {};

  this.destroyable = opts.destroyable || false;
  this.container = container;
  this.headerTag = opts.headerTag || 'h3';
  this.opened = undefined;

  Array.prototype.forEach.call(this.container.getElementsByTagName(this.headerTag), function(el){ 
    this.init(el);
  }, this);  

  this.container.addEventListener('click', function(e) {   
    if(e.target && e.target.tagName === this.headerTag.toUpperCase()) {
      e.target.classList.toggle('accordion-open');

      var wrapper = e.target.nextElementSibling;

      if(wrapper.style.maxHeight === '0px'){
        wrapper.style.maxHeight = wrapper.firstElementChild.getBoundingClientRect().height*2 + 'px'; //http://stackoverflow.com/questions/3508605/css-transition-height-0-to-height-auto
        if(this.opened && this.opened !== e.target) {
          this.opened.nextElementSibling.style.maxHeight = '0px';
          this.opened.nextElementSibling.classList.remove('accordion-open');
          this.opened.classList.remove('accordion-open');
        }
        this.opened = e.target;
      } else {
        wrapper.style.maxHeight = '0px';
      }

      wrapper.classList.toggle('accordion-open');
    } else if (e.target.classList.contains('accordion-destroy')) {
      
      e.preventDefault();

      var id = e.target.parentNode.id
        , accHeader = e.target.parentNode
        , accContent = accHeader.nextElementSibling;


      if(this.opened && this.opened === accHeader) {
        this.opened = undefined;
      }
      this.container.removeChild(accHeader);
      this.container.removeChild(accContent);
      
      this.emit('removed', id);
    }
  }.bind(this));

};

util.inherits(Accordion, events.EventEmitter);


Accordion.prototype.init = function(headerElement){

  //add close
  if(this.destroyable){
    headerElement.insertAdjacentHTML('beforeend', '<a class="accordion-destroy" title="destroy" href="#">&times;</a>');
  }

  var content = headerElement.nextElementSibling;
  content.classList.add('accordion-content');

  //wrap content into a div so that we know the size (for CSS3 transition)...
  var parent = content.parentNode;
  var wrapper = document.createElement('div');
  wrapper.classList.add('accordion-entry');

  // set the wrapper as child (instead of the element)
  parent.replaceChild(wrapper, content);
  // set element as child of wrapper
  wrapper.appendChild(content);

  wrapper.style.maxHeight = '0px';

  this.emit('added', headerElement.id);
};

Accordion.prototype.append = function(html){
  var liveSel = this.container.getElementsByTagName(this.headerTag);
  var offset = liveSel.length;
  this.container.insertAdjacentHTML('beforeend', html);
  for(var i=offset; i<liveSel.length; i++){
    this.init(liveSel[i]);
  }
};


module.exports = Accordion;
