import { Router } from "express";
import {
  createNft,
  deleteNft,
  getNftById,
  getNfts,
  updateNft,
} from "../controllers/nft.controller.js";

const nftRoute = Router();

nftRoute.post("", createNft);
nftRoute.get("", getNfts);
nftRoute.get("/:nftId", getNftById);
nftRoute.delete("/:nftId", deleteNft);
nftRoute.put("/:nftId", updateNft);

export default nftRoute;
