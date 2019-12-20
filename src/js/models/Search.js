import axios from "axios";

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResult() {
    const proxy = "https://cors-anywhere.herokuapp.com/";
    const key = "b8c7cb33664cfb0cb577eb3c03bcae15";
    const appID = "532ba650";
    try {
      const res = await axios(
        `${proxy}https://api.edamam.com/search?q=${this.query}&app_id=${appID}&app_key=${key}`
      );
      this.result = res.data.hits;
    } catch (error) {
      console.error(error);
    }
  }
}
