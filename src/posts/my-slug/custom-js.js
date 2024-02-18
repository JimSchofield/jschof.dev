class MyWebComponent extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open"});

    this.shadowRoot.innerHTML = `
<style>
div {
  background: orange;
  color: blue;
}
</style>
<div>This is a web component</div>
`


  }

  static {
    if (!customElements.get('my-web-component')) {
      customElements.define('my-web-component', this);
    }
  }
}
