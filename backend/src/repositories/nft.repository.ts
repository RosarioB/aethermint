import { Nft } from "@prisma/client";
import prisma from "./client.js";

class NftRepository {
  async createNft(data: Nft) {
    return prisma.nft.create({ data });
  }

  async getNfts() {
    return prisma.nft.findMany();
  }

  async getNftById(nftId: string) {
    return prisma.nft.findFirst({ where: { id: nftId } });
  }

  async deleteNft(nftId: string) {
    return prisma.nft.delete({ where: { id: nftId } });
  }

  async updateNft(nftId: string, data: any) {
    return prisma.nft.update({ where: { id: nftId }, data });
  }
}

export default new NftRepository();
