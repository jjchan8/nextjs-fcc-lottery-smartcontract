import { useMoralis } from "react-moralis";
import { useEffect } from "react";

export default function ManualHeader() {
    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnabledLoading } =
        useMoralis();

    // use of hooks useful to keep track of state between website renders

    // useEffect is constantly running to check if web3 is enabled
    useEffect(() => {
        if (isWeb3Enabled) return;
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem("connected")) {
                enableWeb3();
            }
        }
        // console.log("HI!");
        console.log("Web3 enabled: ", isWeb3Enabled);
    }, [isWeb3Enabled]);
    // automatically run on load, then run checking the value
    // - no dependency array: run anytime something re-renders
    // Careful! As can get circular render
    // - blank dependency array, run once on load (ran twice due to react.strict mode on)
    // - dependency in the array, run anything something in it changes

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`);
            if (account == null) {
                window.localStorage.removeItem("connected");
                deactivateWeb3();
                console.log("Null account found.");
            }
        });
    }, []);

    return (
        <div>
            {account ? (
                <div>
                    Connected to {account.slice(0, 6)}...{account.slice(account.length - 4)}
                </div>
            ) : (
                <button
                    onClick={async () => {
                        {
                            await enableWeb3();

                            if (typeof window !== "undefined") {
                                // store event in browser application
                                // set key value "connected: injected"
                                window.localStorage.setItem("connected", "injected");
                            }
                        }
                    }}
                    disabled={isWeb3EnabledLoading}
                >
                    Connect
                </button>
            )}
        </div>
    );
}
