import {LitElement, html, css} from 'lit-element';


class LazyImage extends LitElement {
  static get properties() {
    return {
      src: {type: String, reflect: true},
      canUseLazyAttr: {type: Boolean},
      interesected: {type: Boolean},
      tolerance: {type: String},
    }
  }

  constructor() {
    super();
    this.interesected = false;
    this.tolerance = '0px 0px 0px 0px';
    this.canUseLazyAttr = 'loading' in HTMLImageElement.prototype;
  }

  firstUpdated() {
    if(!canUseLazyAttr) {
      this.setupIntersectionObserver();
    }
  }

  attributeChangedCallback(name, oldVal, newVal) {
     super.attributeChangedCallback(name, oldVal, newVal);
     if (name === 'src' && (this.canUseLazyAttr || this.interesected)) {
       this.setImageSrc();
     }
  }


  getImage() {
    return this.firstElementChild;
  }

  setImageSrc(value) {
    this.getImage().setAttribute('src', this.src);
  }

  setupIntersectionObserver() {
    const config = {
      rootMargin: this.tolerance,
    };

    new IntersectionObserver(
      this.intersectionObserverCallBack.bind(this),
      config,

    ).observe(this);

  }

  intersectionObserverCallBack(entries, observer) {
    entries.forEach(({isIntersecting}) => {
      if (isIntersecting) {
        observer.disconnect();
        this.setImageSrc();
      }
    });
  }
  render() {
    return html `<slot/>`;
  }
}
customElements.define('lazy-img', LazyImage);