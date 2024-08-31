---
eleventyImport:
  collections: ["posts"]
layout: index
---


<main class="constrain constrain--wide">
    <h1>Posts:</h1>
    <ul class="posts-grid">
        {%- for post in collections.posts reversed -%}
        <li class="posts-grid__item"{% if post.url == page.url %} aria-current="page"{% endif %}>
            <a class="card" href="{{post.url}}">
                {%- if post.data.image -%}
                <img  class="card__image" src="{% joinPaths post.url post.data.image %}" />
                {%- else -%}
                <div class="card__placeholder"></div>
                {%- endif -%}
                <div class="card__detail">
                    <div class="card__title">
                        {{ post.data.title }}
                    </div>
                    <div class="card__date small">
                        {% prettyDate post.date %}
                    </div>
                    <div class="card__excerpt">
                        {{post.data.excerpt}}
                    </div>
                </div>
            </a>
        </li>
        {%- endfor -%}
    </ul>
</main>
