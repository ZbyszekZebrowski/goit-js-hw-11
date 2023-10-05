import axios from "axios";
const instance = axios.create({
    baseURL: 'https://pixabay.com/api/',
    params: {
                key: '39431091-8343d8c42a7054eaef861b00d',
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: 'true',       
            }
})

export class PixabayAPI {
    constructor() {
        this.q = null;
        this.page = 1;
        this.per_page = 40;
    }
    getGalleryCard() {
        const options = {
            params: {
                q: this.q,
                page: this.page,
                per_page: this.per_page,
            }
        };

      return  instance.get('', options).then(response => response.data);
    }
}