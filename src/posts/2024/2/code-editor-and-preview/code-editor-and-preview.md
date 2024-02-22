---
title: Here is where I am making a web component code playground
description: Using plain web components!
layout: post
tags: posts
date: 2024-02-22
---

# Let's try this bad boy out

<style>
play-ground {
    margin-left: calc(50% - 50vw);
    margin-right: calc(50% + 50vw);
}
</style>

<play-ground>
    <template>
        <h1>Hello, World!</h1>
        <p>Seems to work fine!</p>
        <style>
        p {
            color: red;
        }
        </style>
    </template>
</play-ground>

<play-ground>
    <template>
        <details is="my-details">
            <summary>Something</summary>
            Some details
        </details>
        <script>
            class MyDetails extends HTMLDetailsElement {
                connectedCallback() {
                    console.log("hi");
                }
                static {
                    if (!customElements.get("my-details")) {
                        customElements.define("my-details", MyDetails, { extends: "details" });
                    }
                }
            }
    </script>
</template>
</play-ground>

<script src="../../../../js/play-ground.js" type="module"></script>
