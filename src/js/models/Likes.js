import uniqid from "uniqid";

export default class Likes {
  constructor() {
    this.likes = [];
  }

  addLike(url, title, author, img) {
    const like = {
      id: uniqid(),
      url,
      title,
      author,
      img
    };
    this.likes.push(like);
    this.persistData();
    return like;
  }

  deleteLike(title) {
    const index = this.likes.findIndex(el => el.title === title);
    this.likes.splice(index, 1);
    this.persistData();
  }

  isLiked(title) {
    if (this.likes.find(el => el.title === title)) {
      return true;
    } else {
      return false;
    }
  }

  getNumLikes() {
    return this.likes.length;
  }

  persistData() {
    localStorage.setItem("likes", JSON.stringify(this.likes));
  }

  readStorage() {
    const storage = JSON.parse(localStorage.getItem("likes"));
    if (storage) this.likes = storage;
  }
}
