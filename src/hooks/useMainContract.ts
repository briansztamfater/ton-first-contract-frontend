import { Address, OpenedContract } from "ton-core";
import { useEffect, useState } from "react";

import { MainContract } from "../contracts/MainContract";
import { toNano } from "ton-core";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";

export function useMainContract() {
  const client = useTonClient();
  const { sender } = useTonConnect();

  const sleep = (time: number) =>
    new Promise(resolve => setTimeout(resolve, time));

  const [contractData, setContractData] = useState<null | {
    counterValue: number;
    recentSender: Address;
    ownerAddress: Address;
  }>();

  const [balance, setBalance] = useState<null | bigint>(BigInt(0));

  const mainContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new MainContract(
      Address.parse("kQC3fdcbO1r0OnE7CiK7Xl0eHNVjRcLu64O6ZmLOxqSO8e2H")
    );
    return client.open(contract) as OpenedContract<MainContract>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!mainContract) return;
      setContractData(null);
      const val = await mainContract.getData();
      const { balance } = await mainContract.getBalance();
      setContractData({
        counterValue: val.count,
        recentSender: val.recent_sender,
        ownerAddress: val.owner_address,
      });
      setBalance(balance);
      await sleep(5000); // sleep 5 seconds and poll value again
      getValue();
    }
    getValue();
  }, [mainContract]);

  return {
    contractAddress: mainContract?.address.toString(),
    contractBalance: balance,
    ...contractData,
    sendIncrement: async () => {
      return mainContract?.sendIncrement(sender, toNano("0.05"), 5)
    },
    sendDeposit: async () => {
      return mainContract?.sendDeposit(sender, toNano("0.1"))
    },
    sendWithdrawalRequest: async () => {
      return mainContract?.sendWithdrawRequest(sender, toNano("0.05"), toNano("0.07"))
    },
  };
}
