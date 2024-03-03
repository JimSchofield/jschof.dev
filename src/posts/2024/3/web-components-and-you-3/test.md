<play-ground>
  <template>
    <my-element my-attr="My Attribute value!"></my-element>
    <script type="module">
      import {
        LitElement,
        html,
      } from "https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js";

      class MyElement extends LitElement {
        static properties = { myAttr: { attribute: "my-attr" } };

        render() {
          return html`
            <div>This is my component, here is the attr:</div>
            <div>${this.myAttr}</div>
          `;
        }
      }

      customElements.define('my-element', MyElement);
    </script>
  </template>
</play-ground>
