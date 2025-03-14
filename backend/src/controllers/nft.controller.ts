import { Request, Response } from "express";
import NftService from "../services/nft.service.js";

export async function createNft(req: Request, res: Response): Promise<void> {
  try {
    const nft = await NftService.createNft(req.body);
    console.log(`[${new Date().toISOString()}] NFT Successfully Created:`, nft.id);
    res.status(201).json({
      status: true,
      message: "NFT Successfully Created",
      data: nft,
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error creating NFT:`, error);
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
      console.log(`[${new Date().toISOString()}] NFTs Not Found`);
      res.status(404).json({
        status: false,
        message: "NFTs Not Found",
      });
      return;
    }
    console.log(`[${new Date().toISOString()}] NFTs Successfully fetched:`, nfts.map(nft => nft.id));
    res.status(200).json({
      status: true,
      message: "NFTs Successfully fetched",
      data: nfts,
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error fetching NFTs:`, error);
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
      console.log(`[${new Date().toISOString()}] NFT Not Found:`, nftId);
      res.status(404).json({
        status: false,
        message: "NFT Not Found",
      });
      return;
    }
    console.log(`[${new Date().toISOString()}] NFT Successfully fetched:`, nft.id);
    res.status(200).json({
      status: true,
      message: "NFT Successfully fetched",
      data: nft,
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error fetching NFT by ID:`, error);
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
      console.log(`[${new Date().toISOString()}] NFT not found:`, nftId);
      res.status(404).json({
        status: false,
        message: "NFT not found",
      });
      return;
    }
    await NftService.deleteNft(nftId);
    console.log(`[${new Date().toISOString()}] NFT Successfully deleted:`, nftId);
    res.status(200).json({
      status: true,
      message: "NFT Successfully deleted",
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error deleting NFT:`, error);
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
      console.log(`[${new Date().toISOString()}] NFT not found:`, nftId);
      res.status(401).json({
        status: false,
        message: "NFT not found",
      });
      return;
    }
    const updatedNft = await NftService.updateNft(nftId, req.body);
    console.log(`[${new Date().toISOString()}] NFT Successfully updated:`, updatedNft.id);
    res.json({
      status: true,
      message: "NFT Successfully updated",
      data: updatedNft,
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error updating NFT:`, error);
    res.status(500).json({
      status: false,
      message: "server error",
    });
  }
}