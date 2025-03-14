import { Request, Response } from "express";
import prisma from "../repositories/client.js";
import { Data, FarcasterEvent, Mention } from "./types.js";
import { config } from "../config/config.js";
/* import fetch from "node-fetch";
import { ethers } from "ethers"; */

export const mentionWebhook = async (req: Request, res: Response) => {
  console.log("mention aethermint webhook req.body", JSON.stringify(req.body));
  const cast: Data = req.body.data;

  if (!cast) {
    return res.json({ result: "error", response: "No data" });
  }

  /* const existingMention = await prisma.mention.findUnique({
    where: { id: cast.hash }, 
  });
  
  if (existingMention) {
    console.log("cast already processed");
    return res.json({ result: "error", response: "Cast already processed" });
  }
  
  const data = {
    id: cast.hash, // The id of the mention is the hash of the cast
    status: "pending",
    created: new Date(),
    cast: cast,
  };
  await prisma.mention.create({ data }); */

  //await processMention(cast, config.privateKey);

  return res.json({ result: "ok" });
};

export const processMention = async (cast: Data, minter: string) => {
  console.log("processMention started", cast.hash);

  const banList = [];
  if (banList.includes(cast.author.fid)) {
    return { status: "error", reason: "User is banned" };
  }

  const existingToken = await prisma.nft.findFirst({
    where: { castHash: cast.hash },
  });
  if (existingToken) {
    return { status: "error", reason: "Token already created" };
  }

  const ai = await autonomeChat(cast);
  if (!ai.name || !ai.symbol) {
    return { status: "error", reason: "token creation intent not found" };
  }

  const creatorAddress = await verifiedAddress(cast.author);
  if (!creatorAddress) {
    return { status: "error", reason: "creatorAddress not found" };
  }

  const tokenAddress = await deployToken(
    ai.name,
    ai.symbol,
    creatorAddress,
    cast,
    minter
  );
  if (!tokenAddress) {
    return { status: "error", reason: "deploy txn failed" };
  }

  await prisma.token.create({
    data: {
      token: tokenAddress,
      creator: cast.author.fid,
      cast_hash: cast.hash,
    },
  });
  return { status: "processed" };
};

const autonomeChat = async (cast: any) => {
  const apiUrl = "https://autonome.alt.technology/streme-aelyud/chat";
  const data = {
    message: `You are @streme and your primary skill is deploying Super Tokens on request. 
    Super Tokens are ERC20 tokens that can be streamed in real-time by the second, powered by Superfluid. 
    When users request creation of a token, you should extract a name and a symbol from the request, and respond that you will deploy the token on the Base network. 
    The tokens you create are sometimes referred to as Streme Coins. Respond only with a JSON object with elements for name, symbol, and response. 
    Do NOT preface the JSON object with any commentary. Your tone is funny and light-hearted. You strive to please but also to make people laugh. 
    You only create tokens when there is a clear request to do so. When making this assessment, you should ONLY consider the text part of the user's message. 
    If you do not detect a request to create or deploy a token, then return null for title and description, and provide a response explaining. 
    If someone asks you about the kinds of tokens you can create, you can tell them: 1) they are native Super Tokens powered by @superfluid, 2) 
    they have built-in staking with streaming rewards, 3) they are immediately tradeable via a Uniswap v3 pool, 4) 40% of trading fees goes to the creator, and 5) 
    you need a Neynar Score of 0.7 or higher to deploy (threshold may change in future\n\n<example>\nInput: 
    @streme please create a token called yellow flowers with a symbol of YELLOW.\nOutput: name = \"Yellow Flowers\", symbol = \"YELLOW\", 
    response: \"Sure I will create a token called Yellow Flowers on the Base network with the symbol YELLOW\n</example>\n<example>\nInput:
     @streme what type of tokens can you create?\nOutput: I can only create native Super Tokens on the Base network, with real-time streaming powered by @superfluid. 
     The tokens have built-in staking with 20% of the supply being streamed as staking rewards for the first 365 days. The other 80% of supply is locked in a Uniswap v3 pool, 
     with 40% of trading fees going to the deployer.\n</example> The message sender's name is ${cast.author.display_name} with username @${cast.author.username}. 
     Please reply to their message. Only 5% of the time, you mention the message sender in your response. <message>${cast.text}</message>`,
  };
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: "Basic " + process.env.AUTONOME_BASIC_AUTH,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const json = await response.json();
  console.log("autonomeChat", json);
  var aiResponse = json.response[0].replace(/\n/g, "");
  if (aiResponse.startsWith("{") && aiResponse.endsWith("}")) {
    // no-op
  } else if (aiResponse.includes("{") && aiResponse.includes("}")) {
    const start = aiResponse.indexOf("{");
    const end = aiResponse.lastIndexOf("}");
    aiResponse = aiResponse.substring(start, end + 1);
  } else {
    return {
      name: null,
      symbol: null,
      response: aiResponse,
    };
  }
  const responseJson = JSON.parse(aiResponse);
  console.log("responseJson", responseJson);
  return responseJson;
};

const verifiedAddress = async (author: any) => {
  if (
    author &&
    author.verified_addresses &&
    author.verified_addresses.eth_addresses
  ) {
    return author.verified_addresses.eth_addresses[
      author.verified_addresses.eth_addresses.length - 1
    ];
  }
  return null;
};

const deployToken = async (
  name: string,
  symbol: string,
  creatorAddress: string,
  cast: any,
  minter: any
) => {
  const addr = getAddresses();
  const provider = getProvider();
  const key = minter;
  const signer = new ethers.Wallet(key, provider);
  const streme = new ethers.Contract(addr.streme, StremeJSON.abi, signer);
  const poolConfig = {
    tick: -230400,
    pairedToken: addr.weth,
    devBuyFee: 10000,
  };
  const tokenConfig = {
    _name: name,
    _symbol: symbol,
    _supply: ethers.utils.parseEther("100000000000"), // 100 billion
    _fee: 10000,
    _salt: "0x0000000000000000000000000000000000000000000000000000000000000000",
    _deployer: creatorAddress,
    _fid: cast.author.fid,
    _image: await getImageFromCast(cast.embeds),
    _castHash: cast.hash,
    _poolConfig: poolConfig,
  };
  const result = await streme.generateSalt(
    tokenConfig["_symbol"],
    tokenConfig["_deployer"],
    addr.tokenFactory,
    poolConfig.pairedToken
  );
  const salt = result[0];
  let tokenAddress = result[1].toLowerCase();
  tokenConfig["_salt"] = salt;

  let pending = true;
  let retries = 0;
  let gasOptions = {};
  let tx;
  while (pending) {
    try {
      if (process.env.CHAIN === "base") {
        try {
          const resGas = await fetch("https://frm.lol/api/gas/base");
          const gas = await resGas.json();
          if (gas) {
            gasOptions = gas;
          }
        } catch (e) {
          console.log(e);
        }
      }
      tx = await (
        await streme.deployToken(
          addr.tokenFactory,
          addr.postDeployFactory,
          addr.lpFactory,
          ethers.constants.AddressZero,
          tokenConfig,
          gasOptions
        )
      ).wait();
      pending = false;
    } catch (e) {
      const errorCode = e.code;
      if (
        errorCode &&
        (errorCode === "REPLACEMENT_UNDERPRICED" ||
          errorCode === "NONCE_EXPIRED")
      ) {
        pending = true;
        retries++;
        const delay = Math.floor(Math.random() * 4000) + 1000;
        await sleep(delay);
      } else {
        pending = false;
      }
    }
  }

  if (!tx) {
    return false;
  }
  const txnHash = tx.transactionHash;
  const blockNumber = tx.blockNumber;
  const data = {
    id: 69,
    timestamp: new Date(),
    block_number: blockNumber,
    tx_hash: txnHash,
    contract_address: tokenAddress,
    requestor_fid: cast.author.fid,
    name: name,
    symbol: symbol,
    img_url: tokenConfig["_image"],
    pool_address: "",
    cast_hash: cast.hash,
    type: "streme_s" + process.env.SEASON,
    pair: "WETH",
    presale_id: null,
    chain_id: process.env.CHAIN_ID,
    metadata: null,
    tokenFactory: addr.tokenFactory.toLowerCase(),
    postDeployHook: addr.stakingFactory.toLowerCase(),
    liquidityFactory: addr.lpFactory.toLowerCase(),
    postLpHook: ethers.constants.AddressZero,
    poolConfig: poolConfig,
  };
  if (cast.channel && cast.channel.id) {
    data.channel = cast.channel.id;
  }
  await prisma.token.create({ data });
  return tokenAddress;
};

const getAddresses = () => {
  const addr: any = {};
  if (process.env.CHAIN === "baseSepolia") {
    addr.streme = process.env.STREME_BASESEP;
    addr.stakingFactory = process.env.STREME_BASESEP_STAKING_FACTORY;
    addr.postDeployFactory = process.env.STREME_BASESEP_STAKING_FACTORY;
    addr.lpFactory = process.env.STREME_BASESEP_LP_FACTORY;
    addr.superTokenFactory = process.env.STREME_BASESEP_SUPER_TOKEN_FACTORY;
    addr.tokenFactory = process.env.STREME_BASESEP_SUPER_TOKEN_FACTORY;
    addr.lpLocker = process.env.STREME_BASESEP_LIQUIDITY_LOCKER;
    addr.uniswapV3Factory = process.env.BASESEP_UNISWAP_V3_FACTORY;
    addr.weth = process.env.BASESEP_WETH;
    addr.gdaForwarder = process.env.BASESEP_GDA_FORWARDER;
  } else if (process.env.CHAIN === "base") {
    addr.streme = process.env.STREME;
    addr.stakingFactory = process.env.STREME_STAKING_FACTORY;
    addr.postDeployFactory = process.env.STREME_STAKING_FACTORY;
    addr.lpFactory = process.env.STREME_LP_FACTORY;
    addr.superTokenFactory = process.env.STREME_SUPER_TOKEN_FACTORY;
    addr.tokenFactory = process.env.STREME_SUPER_TOKEN_FACTORY;
    addr.lpLocker = process.env.STREME_LIQUIDITY_LOCKER;
    addr.uniswapV3Factory = process.env.UNISWAP_V3_FACTORY;
    addr.weth = process.env.WETH;
    addr.gdaForwarder = process.env.GDA_FORWARDER;
  }
  return addr;
};

const getProvider = () => {
  if (process.env.CHAIN === "baseSepolia") {
    return new ethers.providers.JsonRpcProvider(
      process.env.API_URL_BASESEPOLIA
    );
  } else if (process.env.CHAIN === "base") {
    return new ethers.providers.JsonRpcProvider(process.env.API_URL_BASE);
  }
};

const getImageFromCast = async (embeds: any) => {
  let imageEmbed;
  let contentType;
  let foundImage = false;
  for (let i = 0; i < embeds.length; i++) {
    const embed = embeds[i];
    if ("url" in embed) {
      const url = embed.url;
      if (
        "metadata" in embed &&
        "content_type" in embed.metadata &&
        embed.metadata.content_type.includes("image")
      ) {
        contentType = embed.metadata.content_type;
        foundImage = true;
        imageEmbed = embed;
      } else if (
        "metadata" in embed &&
        "_status" in embed.metadata &&
        embed.metadata._status === "PENDING"
      ) {
        const response = await fetch(url, { method: "HEAD" });
        const headers = response.headers;
        contentType = headers.get("content-type");
        if (contentType && contentType.includes("image")) {
          foundImage = true;
          imageEmbed = embed;
        }
      }
    }
    if (foundImage) {
      break;
    }
  }
  return foundImage ? imageEmbed.url : "";
};

const sleep = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};
