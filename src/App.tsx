import './App.css'

import { TonConnectButton } from '@tonconnect/ui-react'
import { fromNano } from 'ton-core';
import { useMainContract } from './hooks/useMainContract'
import { useTonConnect } from './hooks/useTonConnect';

function App() {
  const {
    contractAddress,
    contractBalance,
    counterValue,
    recentSender,
    ownerAddress,
    sendIncrement,
    sendDeposit,
    sendWithdrawalRequest,
  } = useMainContract();

  const { connected } = useTonConnect();

  return (
    <div>
      <TonConnectButton />
      <div>
        <div className='Card'>
          <b>Our contract Address</b>
          <div className='Hint'>{contractAddress?.slice(0, 30) + "..."}</div>
          <b>Our contract Balance</b>
          <div className='Hint'>{fromNano(contractBalance!)}</div>
        </div>

        <div className='Card'>
          <b>Counter Value</b>
          <div>{counterValue ?? 'Loading...'}</div>
          <b>Recent Sender</b>
          <div>{recentSender?.toString() ?? 'Loading...'}</div>
          <b>Owner Address</b>
          <div>{ownerAddress?.toString() ?? 'Loading...'}</div>
        </div>

        {connected && (
          <a onClick={() => {
            sendIncrement();
          }}>
            Increment by 5
          </a>
        )}

        <br />

        {connected && (
          <a onClick={() => {
            sendDeposit();
          }}>
            Request deposit of 0.1 TON
          </a>
        )}

        <br />

        {connected && (
          <a onClick={() => {
            sendWithdrawalRequest();
          }}>
            Request 0.7 TON for withdrawal
          </a>
        )}
      </div>
    </div>
  )
}

export default App
