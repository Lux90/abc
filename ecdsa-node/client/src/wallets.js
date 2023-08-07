
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex } from "ethereum-cryptography/utils";

export const generateWallets = (count) => Array.from({length: count}, (_, id) => {
    const pk = secp256k1.utils.randomPrivateKey();
    const pub = secp256k1.getPublicKey(pk);
    const address = toHex(keccak256(pub.slice(1)).slice(-20));
    return {id, pk, pub, address};
});
