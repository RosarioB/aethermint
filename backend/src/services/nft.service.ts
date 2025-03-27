import { Nft } from "../models/nft.model.js";
import NftRepository from "../repositories/nft.repository.js";

class NftService {
  async createNft(data: Nft): Promise<Nft> {
    return NftRepository.createNft(data);
  }

  async getNfts(): Promise<Nft[]> {
    return NftRepository.getNfts();
  }

  async getNftById(nftId: string): Promise<Nft | null> {
    return NftRepository.getNftById(nftId);
  }

  async deleteNft(nftId: string): Promise<void> {
    NftRepository.deleteNft(nftId);
  }

  async updateNft(nftId: string, data: Partial<Nft>): Promise<Nft> {
    return NftRepository.updateNft(nftId, data);
  }
}

export default new NftService();
