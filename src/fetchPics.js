const axios = require('axios').default;
const BASE_URL = 'https://pixabay.com/api/?key=24733344-a7c635fb3d48788b7b7d4e05e'

export default class ApiSearch{
    constructor() {
        this.searchedItems = ''
        this.page = 1
    }

    async fetchTotalHits() {
        const fetchTotalHits = await axios.get(`${BASE_URL}&q=${this.searchedItems}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`)
        const totalHitsJson = await fetchTotalHits.data
        const totalHits = await totalHitsJson.totalHits
          return  totalHits
    }
    
   async fetchPics() {
        const fetchHits = await axios.get(`${BASE_URL}&q=${this.searchedItems}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`)
       const hitsJson = await fetchHits.data
       const hits = await hitsJson.hits
       if (hits) {
           this.page += 1 
       }
       return hits

    }
  
    resetItems() {

        this.page = 1
    }

}
 