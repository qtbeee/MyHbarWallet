import Wallet from "../Wallet";
import "regenerator-runtime"; // https://github.com/LedgerHQ/ledgerjs/issues/332
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";

// Preserving, in case we need this later
// export const LEDGER_HEDERA_PATH = "44'/3030'/0'/0'/0'";

export const INDEX = 0x01; // Key Index on Ledger

export const CLA = 0xE0;
const INS_GET_PK = 0x02;
const INS_SIGN_TX = 0x04;

// While we do have tos end P1 and P2, we don't actually use them
const P1_UNUSED_APDU = 0x00;
const P2_UNUSED_APDU = 0x00;

export type LedgerDeviceStatus = {
    deviceStatus: number;
    publicKey?: import("@hashgraph/sdk").PublicKey | null;
    deviceId?: string;
};

export default class LedgerNanoS implements Wallet {
    public hasPrivateKey(): boolean {
        return false;
    }

    public async getPrivateKey(): Promise<
        import("@hashgraph/sdk").Ed25519PrivateKey
    > {
        throw new Error("Cannot get private key from ledger wallet");
    }

    public async getPublicKey(): Promise<
        import("@hashgraph/sdk").PublicKey | null
    > {
        const buffer = Buffer.alloc(4);
        buffer.writeUInt32LE(INDEX, 0);

        let transport: TransportWebUSB | null | void = null;
        let response: Buffer | null = null;

        try {
            transport = await TransportWebUSB.create().then(
                async (transport: TransportWebUSB) => {
                    response = await transport.send(
                        CLA,
                        INS_GET_PK,
                        P1_UNUSED_APDU,
                        P2_UNUSED_APDU,
                        buffer
                    );
                }
            );

            if (response !== null) {
                const publicKeyStr = response
                    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                    // @ts-ignore
                    .slice(0, response.length - 2)
                    .toString("hex");

                const publicKey = (await import(
                    "@hashgraph/sdk"
                )).Ed25519PublicKey.fromString(publicKeyStr);

                return publicKey;
            }

            return null;
        } finally {
            if (transport !== null && transport !== undefined) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                await transport.close();
            }
        }
    }

    public async signTransaction(
        txnData: Buffer | Uint8Array
    ): Promise<Uint8Array | null> {
        const dataBuffer = Buffer.from(txnData);

        const buffer = Buffer.alloc(4 + dataBuffer.length);
        buffer.writeUInt32LE(INDEX, 0);
        buffer.fill(dataBuffer, 4);

        let transport: TransportWebUSB | null | void = null;
        let response: Buffer | null = null;

        try {
            transport = await TransportWebUSB.create().then(
                async (transport: TransportWebUSB) => {
                    response = await transport.send(
                        CLA,
                        INS_SIGN_TX,
                        P1_UNUSED_APDU,
                        P2_UNUSED_APDU,
                        buffer
                    );
                }
            );

            if (response !== null) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                return new Uint8Array(response.slice(0, response.length - 2));
            }

            return null;
        } finally {
            if (transport !== null && transport !== undefined) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                await transport.close();
            }
        }
    }
}
