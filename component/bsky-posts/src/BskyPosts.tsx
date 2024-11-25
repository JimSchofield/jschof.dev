import { Post } from "./Post";
import useFetchPosts from "./useFetchPosts";

export function BskyPosts({ did = "" }) {
  if (!did) {
    throw new Error(
      "bsky-posts requires an argument 'did' where you can supply your profile did",
    );
  }

  const [posts, status] = useFetchPosts(did);

  return (
    <>
      {status === "FETCHING" && <div>Loading posts...</div>}
      {status === "SUCCESS" && (
        <ol class="bsky-post-list">
          {posts.map((p) => {
            return <li><Post post={p} /></li>;
          })}
        </ol>
      )}
      {status === "ERROR" && <div>Error!</div>}
    </>
  );
}
