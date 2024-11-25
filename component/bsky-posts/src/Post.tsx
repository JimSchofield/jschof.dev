import { LikeIcon } from "./icons/LikeIcon";
import { QuotedIcon } from "./icons/QuotedIcon";
import { ReplyIcon } from "./icons/ReplyIcon";
import { PostEmbed } from "./PostEmbed";
import { type PostType } from "./types";

export function Post({ post }: { post: PostType }) {
  return (
    <div class="bsky-post">
      <div class="bsky-post__avatar">
        <img src={post.author.avatar} />
      </div>
      <div>
        <div class="bsky-post__header-content">
          <div class="bsky-post__title">{post.author.displayName}</div>
          <div class="bsky-post__handle">@{post.author.handle}</div>
        </div>
        <div class="bsky-post__content">{post.record.text}</div>
        <PostEmbed embed={post.embed} />
        <div class="bsky-post__footer">
          <div class="bsky-post__footer-icon">
            <ReplyIcon />
            {post.replyCount}
          </div>
          <div class="bsky-post__footer-icon">
            <LikeIcon />
            {post.likeCount}
          </div>
          <div class="bsky-post__footer-icon">
            <QuotedIcon />
            {post.quoteCount}
          </div>
        </div>
      </div>
    </div>
  );
}
