import { Web3Storage, File } from "web3.storage";

const token = process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN;

export async function uploadToIPFS(file: globalThis.File | Blob, name?: string) {
	if (!token) throw new Error("Falta NEXT_PUBLIC_WEB3STORAGE_TOKEN");
	const client = new Web3Storage({ token });
	const f = new File([file], name || (file as any)?.name || "evidence.bin");
	const cid = await client.put([f], { wrapWithDirectory: false });
	return `ipfs://${cid}`;
}


