import { useEffect, useState } from "preact/hooks";
import { PostType } from "./types";

// const myDid = `did:plc:nturfjwjp6d76cbnblvhjovo`;

const bskyMain = `https://public.api.bsky.app/xrpc/`;
const action = `app.bsky.feed.getAuthorFeed?`;
const params = (did: string, limit: number) =>
  `actor=${did}&filter=posts_with_replies&limit=${limit}`;

type Result = {
  feed: { post: PostType }[];
};

const fetchStatus = ['READY', 'FETCHING', 'ERROR', 'SUCCESS'] as const;
type Status = (typeof fetchStatus)[number];

export default function useFetchPosts(did: string, limit: number) {
  let [posts, setPosts] = useState<PostType[]>([]);
  let [status, setStatus] = useState<Status>('READY');

  useEffect(() => {
    setStatus('FETCHING')
    fetch(`${bskyMain}${action}${params(did, limit)}`)
      .then((res) => res.json())
      .then((data: Result) => {
        const posts = data.feed.map(({ post }) => post);

        setPosts(posts);
        setStatus('SUCCESS');
      })
      .catch(e => {
        console.error(e);
        setPosts([]);
        setStatus('ERROR');
      });
  }, [])

  return [posts, status] as const;
}
