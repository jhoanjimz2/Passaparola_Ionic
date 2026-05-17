import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LikeButtonService {

  constructor() { }
  updateLikeInMultipleArrays(postArrays: any[][], idPost: string, like: any): void {
    postArrays.forEach(posts => {
      this.updateLikeInArray(posts, idPost, like);
    });
  }
  updateLikeInArray(posts: any[], idPost: string, like: any): void {
    const postIndex = posts.findIndex(post => post.id === idPost);
    if (postIndex === -1) return;
    const post = posts[postIndex];
    post.likes ??= [];
    const existingLikeIndex = post.likes.findIndex((existingLike: any) => existingLike.id === like.id);
    if (existingLikeIndex !== -1) {
      post.likes[existingLikeIndex] = like;
    } else {
      post.likes.push(like);
    }
  }
}
