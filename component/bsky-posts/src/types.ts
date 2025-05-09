/*
 * Listen, this isn't going to win any awards.  I know
 * there's an SDK package you can use to interact with bluesky...
 * I just wanted to get quick and dirty types based on the http
 * api I was working with.  So I'm going to let this be, okay?
 * Someday, when I retire early and rich and I'm on my yacht looking
 * for something to do I'll pull this up and think: "time to normalize
 * these types," but until that day...
 */

export type PostType = {
  uri: string;
  cid: string;
  author: {
    did: string;
    handle: string;
    displayName: string;
    avatar: string;
    associated: {
      chat: {
        allowIncoming: string;
      };
    };
    labels: [];
    createdAt: string;
  };
  record: {
    $type: string;
    createdAt: string;
    embed: {
      $type: string;
      external: {
        description: string;
        thumb: {
          $type: string;
          ref: {
            $link: string;
          };
          mimeType: string;
          size: number;
        };
        title: string;
        uri: string;
      };
    };
    facets: [
      {
        features: [
          {
            $type: string;
            uri: string;
          },
        ];
        index: {
          byteEnd: number;
          byteStart: number;
        };
      },
    ];
    langs: [string];
    text: string;
  };
  embed?:
    | {
        $type: "app.bsky.embed.record#view";
        record: {
          $type: "app.bsky.embed.record#viewRecord";
          uri: "at://did:plc:nturfjwjp6d76cbnblvhjovo/app.bsky.feed.post/3lbsazmizs22u";
          cid: "bafyreigvov5eaee4brwvq4mwqumrm7igprysv4h4vrwmmdn4lyswxgsmqa";
          author: {
            did: "did:plc:nturfjwjp6d76cbnblvhjovo";
            handle: "jschof.dev";
            displayName: "🍂 Jim Schofield 🍁";
            avatar: "https://cdn.bsky.app/img/avatar/plain/did:plc:nturfjwjp6d76cbnblvhjovo/bafkreiftrz57sb557daypbvl74kjiu4ywsyokexyern7wzynm4lsylluee@jpeg";
            associated: {
              chat: {
                allowIncoming: "following";
              };
            };
            labels: [];
            createdAt: "2023-11-03T15:53:59.563Z";
          };
          value: {
            $type: "app.bsky.feed.post";
            createdAt: "2024-11-25T19:29:09.468Z";
            embed: {
              $type: "app.bsky.embed.images";
              images: [
                {
                  alt: 'A very cool cat wearing shades while "the future\'s so bright" is obviously playing';
                  aspectRatio: {
                    height: 406;
                    width: 442;
                  };
                  image: {
                    $type: "blob";
                    ref: {
                      $link: "bafkreid3gbgsxqubcf2uq3ahqdwqhh2kombg45lbtq2udfhexgmbnzls5e";
                    };
                    mimeType: "image/jpeg";
                    size: 162297;
                  };
                },
              ];
            };
            langs: ["en"];
            text: "Testing out a thing...";
          };
          labels: [];
          likeCount: 0;
          replyCount: 0;
          repostCount: 0;
          quoteCount: 1;
          indexedAt: "2024-11-25T19:29:11.254Z";
          embeds: [
            {
              $type: "app.bsky.embed.images#view";
              images: [
                {
                  thumb: "https://cdn.bsky.app/img/feed_thumbnail/plain/did:plc:nturfjwjp6d76cbnblvhjovo/bafkreid3gbgsxqubcf2uq3ahqdwqhh2kombg45lbtq2udfhexgmbnzls5e@jpeg";
                  fullsize: "https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:nturfjwjp6d76cbnblvhjovo/bafkreid3gbgsxqubcf2uq3ahqdwqhh2kombg45lbtq2udfhexgmbnzls5e@jpeg";
                  alt: 'A very cool cat wearing shades while "the future\'s so bright" is obviously playing';
                  aspectRatio: {
                    height: 406;
                    width: 442;
                  };
                },
              ];
            },
          ];
        };
      }
    | {
        $type: "app.bsky.embed.external#view";
        external: {
          uri: string;
          title: string;
          description: string;
          thumb: string;
        };
      }
    | {
        $type: "app.bsky.embed.recordWithMedia#view";
        media: {
          $type: string;
          external: {
            description: string;
            thumb: string;
            title: string;
            uri: string;
          };
        };
      }
    | {
        $type: "app.bsky.embed.images#view";
        images: {
          alt: string;
          aspectRatio: { height: number; width: number };
          fullsize: string;
          thumb: string;
        }[];
      };
  replyCount: number;
  repostCount: number;
  likeCount: number;
  quoteCount: number;
  indexedAt: string;
  labels: [];
};
