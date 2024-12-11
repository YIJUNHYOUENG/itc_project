import { SHA256 } from "crypto-js";

export function passwordEncryption(pwd) {
    const hash = SHA256(pwd).toString();

    return hash;
}