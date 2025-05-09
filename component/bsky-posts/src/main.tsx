import register from 'preact-custom-element';
import './index.css';
import { BskyPosts } from './BskyPosts.tsx'

register(BskyPosts, 'bsky-posts', ['did', 'limit'], { shadow: false });
