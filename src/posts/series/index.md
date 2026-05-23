---
eleventyImport:
  collections: ["posts"]
layout: index
title: "Posts by series"
---

{%- assign grouped = collections.posts | groupBySeries -%}

<main class="constrain constrain--wide">
    <div class="posts-header">
        <h1>Posts by series</h1>
        <p class="posts-view-toggle">View as: <a href="/posts/">Grid</a> | <strong>By series</strong></p>
    </div>

    {%- for group in grouped.series -%}
    <section class="series-section">
        <h2 class="series-section__heading">{{ group.name }}</h2>
        <ul class="series-list">
            {%- for post in group.posts -%}
            <li class="series-list__item">
                <a class="series-row" href="{{ post.url }}">
                    {%- if post.data.image -%}
                    <img class="series-row__image" src="{% joinPaths post.url post.data.image %}" loading="lazy" alt="" />
                    {%- else -%}
                    <div class="series-row__image series-row__image--placeholder"></div>
                    {%- endif -%}
                    <div class="series-row__detail">
                        <div class="series-row__title">{{ post.data.title }}<span class="series-row__date small">{% prettyDate post.date %}</span></div>
                        <div class="series-row__excerpt">{{ post.data.excerpt }}</div>
                    </div>
                </a>
            </li>
            {%- endfor -%}
        </ul>
    </section>
    {%- endfor -%}

    {%- if grouped.standalone.length -%}
    <section class="series-section">
        <h2 class="series-section__heading">Standalone posts</h2>
        <ul class="series-list">
            {%- for post in grouped.standalone -%}
            <li class="series-list__item">
                <a class="series-row" href="{{ post.url }}">
                    {%- if post.data.image -%}
                    <img class="series-row__image" src="{% joinPaths post.url post.data.image %}" loading="lazy" alt="" />
                    {%- else -%}
                    <div class="series-row__image series-row__image--placeholder"></div>
                    {%- endif -%}
                    <div class="series-row__detail">
                        <div class="series-row__title">{{ post.data.title }}<span class="series-row__date small">{% prettyDate post.date %}</span></div>
                        <div class="series-row__excerpt">{{ post.data.excerpt }}</div>
                    </div>
                </a>
            </li>
            {%- endfor -%}
        </ul>
    </section>
    {%- endif -%}
</main>
