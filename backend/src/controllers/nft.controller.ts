import { Request, Response } from "express";
import NftService from "../services/nft.service.js";
import { errorWithTimestamp, logWithTimestamp } from "../utils/logging.js";

export async function createNft(req: Request, res: Response): Promise<void> {
  try {
    const nft = await NftService.createNft(req.body);
    logWithTimestamp(`NFT Successfully Created: ${nft.id}`);
    res.status(200).json({
      status: true,
      message: "NFT Successfully Created",
      data: nft,
    });
  } catch (error) {
    errorWithTimestamp(
      `[${new Date().toISOString()}] Error creating NFT:`,
      error
    );
    res.status(500).json({
      status: false,
      message: "server error",
    });
  }
}

export async function getNfts(req: Request, res: Response): Promise<void> {
  try {
    const nfts = await NftService.getNfts();
    if (!nfts) {
      logWithTimestamp(`NFTs Not Found`);
      res.status(404).json({
        status: false,
        message: "NFTs Not Found",
      });
      return;
    }
    logWithTimestamp(`NFTs Successfully fetched: ${nfts.map((nft) => nft.id)}`);
    res.status(200).json({
      status: true,
      message: "NFTs Successfully fetched",
      data: nfts,
    });
  } catch (error) {
    errorWithTimestamp(`Error fetching NFTs:`, error);
    res.status(500).json({
      status: false,
      message: "server error",
    });
  }
}

export async function getNftById(req: Request, res: Response): Promise<void> {
  try {
    const { nftId } = req.params;
    const nft = await NftService.getNftById(nftId);
    if (!nft) {
      logWithTimestamp(`NFT Not Found: ${nftId}`);
      res.status(404).json({
        status: false,
        message: "NFT Not Found",
      });
      return;
    }
    logWithTimestamp(`NFT Successfully fetched: ${nft.id}`);
    res.status(200).json({
      status: true,
      message: "NFT Successfully fetched",
      data: nft,
    });
  } catch (error) {
    errorWithTimestamp(`Error fetching NFT by ID:`, error);
    res.status(500).json({
      status: false,
      message: "An error occurred",
    });
  }
}

export async function deleteNft(req: Request, res: Response): Promise<void> {
  try {
    const { nftId } = req.params;
    const nft = await NftService.getNftById(nftId);
    if (!nft) {
      logWithTimestamp(`NFT not found: ${nftId}`);
      res.status(404).json({
        status: false,
        message: "NFT not found",
      });
      return;
    }
    await NftService.deleteNft(nftId);
    logWithTimestamp(`NFT Successfully deleted: ${nftId}`);
    res.status(200).json({
      status: true,
      message: "NFT Successfully deleted",
    });
  } catch (error) {
    errorWithTimestamp(`Error deleting NFT:`, error);
    res.status(500).json({
      status: false,
      message: "server error",
    });
  }
}

export async function updateNft(req: Request, res: Response): Promise<void> {
  try {
    const { nftId } = req.params;
    const nft = await NftService.getNftById(nftId);
    if (!nft) {
      logWithTimestamp(`NFT not found: ${nftId}`);
      res.status(404).json({
        status: false,
        message: "NFT not found",
      });
      return;
    }
    const updatedNft = await NftService.updateNft(nftId, req.body);
    logWithTimestamp(`NFT Successfully updated: ${updatedNft.id}`);
    res.json({
      status: true,
      message: "NFT Successfully updated",
      data: updatedNft,
    });
  } catch (error) {
    errorWithTimestamp(`Error updating NFT:`, error);
    res.status(500).json({
      status: false,
      message: "server error",
    });
  }
}
