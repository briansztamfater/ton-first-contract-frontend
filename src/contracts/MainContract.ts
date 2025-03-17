import { Address, Cell, Contract, ContractProvider, SendMode, Sender, beginCell, contractAddress } from "ton-core";

export type MainContractConfig = {
  number: number;
  address: Address;
  ownerAddress: Address;
}

export function mainContractConfigCell(config: MainContractConfig): Cell {
  return beginCell()
    .storeUint(config.number, 32)
    .storeAddress(config.address)
    .storeAddress(config.ownerAddress)
    .endCell();
}

export enum MainContractOpCodes {
  INCREMENT = 1,
  DEPOSIT = 2,
  WITHDRAW = 3,
  DESTROY = 4,
  UNKNOWN = 9999,
}

export class MainContract implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) { }

  static createFromConfig(config: MainContractConfig, code: Cell, workchain: number = 0) {
    const data = mainContractConfigCell(config);
    const init = { code, data };
    const address = contractAddress(workchain, init);

    return new MainContract(address, init);
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().storeUint(MainContractOpCodes.DEPOSIT, 32).endCell(),
    });
  }

  async sendIncrement(
    provider: ContractProvider,
    sender: Sender,
    value: bigint,
    incrementBy: number,
  ) {
    const body = beginCell()
                  .storeUint(MainContractOpCodes.INCREMENT, 32)
                  .storeUint(incrementBy, 32)
                  .endCell();
    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body,
    });
  }

  async sendDeposit(
    provider: ContractProvider,
    sender: Sender,
    value: bigint,
  ) {
    const body = beginCell()
                  .storeUint(MainContractOpCodes.DEPOSIT, 32)
                  .endCell();
    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body,
    });
  }

  async sendWithdrawRequest(
    provider: ContractProvider,
    sender: Sender,
    value: bigint,
    amount: bigint,
  ) {
    const body = beginCell()
                  .storeUint(MainContractOpCodes.WITHDRAW, 32)
                  .storeCoins(amount)
                  .endCell();
    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body,
    });
  }

  async sendNoOpCodeDeposit(
    provider: ContractProvider,
    sender: Sender,
    value: bigint,
  ) {
    const body = beginCell()
                  .storeUint(MainContractOpCodes.UNKNOWN, 32)
                  .endCell();
    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body,
    });
  }

  async sendDestroy(
    provider: ContractProvider,
    sender: Sender,
    value: bigint,
  ) {
    const body = beginCell()
                  .storeUint(MainContractOpCodes.DESTROY, 32)
                  .endCell();
    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body,
    });
  }

  async getData(provider: ContractProvider) {
    const { stack } = await provider.get("get_contract_storage_data", []);
    return {
      count: stack.readNumber(),
      recent_sender: stack.readAddress(),
      owner_address: stack.readAddress(),
    };
  }

  async getBalance(provider: ContractProvider) {
    const { stack } = await provider.get("balance", []);
    return {
      balance: stack.readBigNumber(),
    };
  }
}
