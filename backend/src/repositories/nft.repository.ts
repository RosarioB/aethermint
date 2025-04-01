import { Nft, NftModel } from "../models/nft.model.js";

class NftRepository {
  async createNft(data: Nft) {
    const nft = new NftModel(data);
    return nft.save();
  }

  async getNfts() {
    return NftModel.find();
  }

  async getNftById(nftId: string) {
    return NftModel.findOne({ id: nftId });
  }

  async deleteNft(nftId: string) {
    return NftModel.findOneAndDelete({ id: nftId });
  }

  async updateNft(nftId: string, data: Partial<Nft>) {
    return NftModel.findOneAndUpdate({ id: nftId }, data, { new: true });
  }
}

export default new NftRepository();
