import { PostType } from "./types";

export function PostEmbed({ embed }: { embed: PostType["embed"] }) {
  if (!embed) {
    return null;
  }

  console.log(embed);

  if (embed.$type === "app.bsky.embed.record#view") {
    return (
      <div class="bsky-embed">
        <a class="bsky-embed-card" href={embed.record.uri}>
          <div>{embed.record.value.text}</div>
        </a>
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

  if (embed.$type === "app.bsky.embed.recordWithMedia#view") {
    return (
      <div class="bsky-embed">
        <img
          class="bsky-embed-card__media"
          src={embed.media.external.uri}
          alt={embed.media.external.title}
        />
      </div>
    );
  }
}
