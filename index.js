function Accordion(container, headerTag){

  this.container = container;
  this.headerTag = headerTag || 'h3';
  this.opened = undefined;

  Array.prototype.forEach.call(this.container.getElementsByTagName(this.headerTag), function(el){ 
    this.init(el);
  }, this);  


  this.container.addEventListener('click', function(e) {   
    if(e.target && e.target.tagName === this.headerTag.toUpperCase()) {
      e.target.classList.toggle('accordion-open');

      var wrapper = e.target.nextElementSibling;

      if(wrapper.style.maxHeight === '0px'){
        wrapper.style.maxHeight = wrapper.firstElementChild.getBoundingClientRect().height + 'px';
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
    }
  }.bind(this));

};

Accordion.prototype.init = function(headerElement){
  var content = headerElement.nextElementSibling;
  content.classList.add('accordion-content');

  //wrap content into a div so that we know the size (for CSS3 transition)...
  var parent = content.parentNode;
  var wrapper = document.createElement('div');

  // set the wrapper as child (instead of the element)
  parent.replaceChild(wrapper, content);
  // set element as child of wrapper
  wrapper.appendChild(content);

  wrapper.style.maxHeight = '0px';
};

Accordion.prototype.append = function(html){
  var liveSel = this.container.getElementsByTagName(this.headerTag);
  var offset = liveSel.length;
  this.container.insertAdjacentHTML('beforeend', html);
  for(var i=offset; i<liveSel.length; i++){
    this.init(liveSel[i]);
  }
};

if (typeof module !== 'undefined' && module.exports){
  module.exports = Accordion;
}
