import TrezorConnect, { PublicKey } from "trezor-connect";

// Point to the trezor connect service
// @ts-ignore
window.__TREZOR_CONNECT_SRC = 'http://localhost:8088/';

let isInitialized = false;

async function initIfNeeded() {
    if (!isInitialized) {
        isInitialized = true;

        // @ts-ignore
        await TrezorConnect.manifest({
            email: "contact@launchbadge.com",
            appUrl: "https://myhederawallet.com"
        });

        await TrezorConnect.init({
            debug: true,
            // popup: true,
            // Point to our local trezor connect
            // FIXME: Remove when done
            // connectSrc: "http://localhost:8088/",
            // origin: "*",
        });
    }
}

// TODO: Get the coin type that the mobile wallets have been using for hedera
const COIN_TYPE = '134';

function getPath(account: number, index: number): string {
    // m’ / purpose’ / coin_type’ / account’ / change / address_index
    // purpose=44 is a constant meaning that this path follows BIP-44
    //
    return `m/44'/${COIN_TYPE}'/${account}'/0'/${index}'`;
}

export async function getPublicKey(index: number = 0) {
    await initIfNeeded();

    // @ts-ignore
    const result = await TrezorConnect.hederaGetPublicKey({
        path: getPath(0, index),
    });

    debugger;

    return result.payload.publicKey;
}

export async function makeSigner(index: number = 0): Promise<(message: Uint8Array) => Promise<Uint8Array>> {
    await initIfNeeded();

    return async (message: Uint8Array) => {
        // @ts-ignore
        const result = await TrezorConnect.hederaSignMessage({
            path: getPath(0, index),
            message: Buffer.from(message).toString('hex'),
        });

        debugger;

        const hexSignature = result.payload.signature;
        const signature = new Uint8Array(Buffer.from(hexSignature, "hex"));

        return signature;
    };
}
