import Image from "../models/Image";
import Orphanage from "../models/Orphanage";

export default {
  render(image: Image) {
    return {
      id: image.id,
      url: `http://192.168.15.12:3333/uploads/${encodeURIComponent(image.path)}`
    }
  },

  renderMany(images: Image[]) {
    return images.map(image => this.render(image));
  }
}