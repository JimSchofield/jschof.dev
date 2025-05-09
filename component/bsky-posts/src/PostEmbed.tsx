import { PostType } from "./types";

export function PostEmbed({ embed }: { embed: PostType["embed"] }) {
  if (!embed) {
    return null;
  }

  if (embed.$type === "app.bsky.embed.record#view") {
    return (
      <div class="bsky-embed">
        <div class="bsky-embed-card">
          <div>{embed.record.value.text}</div>
        </div>
      </div>
    );
  }

  if (embed.$type === "app.bsky.embed.external#view") {
    return (
      <div class="bsky-embed">
        <a class="bsky-embed-card" href={embed.external.uri}>
          <div>{embed.external.title}</div>
          <img
            class="bsky-embed-card__media-thumb"
            src={embed.external.thumb}
          />
        </a>
      </div>
    );
  }

  if (embed.$type === "app.bsky.embed.images#view") {
    return (
      <div class="bsky-embed">
        {embed.images.map((img) => {
          return (
            <img
              class="bsky-embed-card__media"
              src={img.fullsize}
              alt={img.alt}
            />
          );
        })}
      </div>
    );
  }

  return null;
}
